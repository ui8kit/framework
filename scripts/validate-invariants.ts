#!/usr/bin/env bun
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import { dirname, extname, join, relative } from "path";
import { fileURLToPath } from "url";

interface CheckIssue {
  level: "error" | "warn";
  code: string;
  message: string;
  path?: string;
}

interface PageEntry {
  id: string;
  domain: "website" | "admin";
  path: string;
}

interface PageFixture {
  page: {
    website: PageEntry[];
    admin: PageEntry[];
  };
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const reportsDir = join(repoRoot, ".cursor", "reports");

const criticalContentPaths = [
  "apps/engine/src/App.tsx",
  "apps/engine/src/layouts/views/MainLayoutView.tsx",
  "apps/engine/src/blocks/admin/AdminDashboardPageView.tsx",
  "packages/data/src/index.ts",
  "packages/data/src/fixtures/shared/site.json",
  "packages/data/src/fixtures/shared/navigation.json",
];

const forbiddenTerms = ["restaurant", "bar", "menu", "recipes", "promotions"];

function readText(relPath: string): string {
  return readFileSync(join(repoRoot, relPath), "utf-8");
}

function collectFiles(dirRelPath: string): string[] {
  const full = join(repoRoot, dirRelPath);
  if (!existsSync(full)) return [];
  const stats = statSync(full);
  if (stats.isFile()) return [dirRelPath];
  const out: string[] = [];
  for (const entry of readdirSync(full, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const childRel = join(dirRelPath, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(childRel));
    else if ([".ts", ".tsx", ".json", ".md"].includes(extname(entry.name))) out.push(childRel);
  }
  return out;
}

function addIssue(issues: CheckIssue[], issue: CheckIssue): void {
  issues.push(issue);
}

function main(): void {
  const issues: CheckIssue[] = [];
  const runId = `invariants_${Date.now()}`;

  const pageFixturePath = "packages/data/src/fixtures/shared/page.json";
  const pageFixture = JSON.parse(readText(pageFixturePath)) as PageFixture;

  const domainKeys = Object.keys(pageFixture.page).sort();
  if (domainKeys.join(",") !== "admin,website") {
    addIssue(issues, {
      level: "error",
      code: "DOMAIN_KEYS_MISMATCH",
      message: `Expected page domains [admin, website], got [${domainKeys.join(", ")}].`,
      path: pageFixturePath,
    });
  }

  const requiredWebsitePaths = ["/", "/components", "/guides", "/guides/:slug", "/blog", "/blog/:slug", "/showcase"];
  const requiredAdminPaths = ["/admin", "/admin/dashboard"];
  const websitePaths = new Set((pageFixture.page.website ?? []).map((entry) => entry.path));
  const adminPaths = new Set((pageFixture.page.admin ?? []).map((entry) => entry.path));

  for (const path of requiredWebsitePaths) {
    if (!websitePaths.has(path)) {
      addIssue(issues, {
        level: "error",
        code: "MISSING_WEBSITE_ROUTE",
        message: `Missing required website route: ${path}`,
        path: pageFixturePath,
      });
    }
  }
  for (const path of requiredAdminPaths) {
    if (!adminPaths.has(path)) {
      addIssue(issues, {
        level: "error",
        code: "MISSING_ADMIN_ROUTE",
        message: `Missing required admin route: ${path}`,
        path: pageFixturePath,
      });
    }
  }

  for (const entry of pageFixture.page.website ?? []) {
    if (entry.domain !== "website") {
      addIssue(issues, {
        level: "error",
        code: "WEBSITE_DOMAIN_TAG_MISMATCH",
        message: `Page entry ${entry.id} has domain=${entry.domain}, expected website.`,
        path: pageFixturePath,
      });
    }
  }
  for (const entry of pageFixture.page.admin ?? []) {
    if (entry.domain !== "admin") {
      addIssue(issues, {
        level: "error",
        code: "ADMIN_DOMAIN_TAG_MISMATCH",
        message: `Page entry ${entry.id} has domain=${entry.domain}, expected admin.`,
        path: pageFixturePath,
      });
    }
  }

  const contextIndexPath = "packages/data/src/index.ts";
  const contextIndex = readText(contextIndexPath);
  const requiredContextSymbols = [
    "components",
    "guides",
    "showcase",
    "getPageByPath",
    "getPagesByDomain",
    "resolveNavigation",
    "getAdminSidebarLinks",
  ];
  for (const symbol of requiredContextSymbols) {
    if (!contextIndex.includes(symbol)) {
      addIssue(issues, {
        level: "error",
        code: "MISSING_CONTEXT_SYMBOL",
        message: `Missing context symbol in data index: ${symbol}`,
        path: contextIndexPath,
      });
    }
  }

  const appPath = "apps/engine/src/App.tsx";
  const appContent = readText(appPath);
  for (const routePath of [...requiredWebsitePaths, ...requiredAdminPaths]) {
    if (!appContent.includes(`path="${routePath}"`)) {
      addIssue(issues, {
        level: "error",
        code: "ROUTE_NOT_WIRED_IN_ENGINE",
        message: `Route not wired in apps/engine App.tsx: ${routePath}`,
        path: appPath,
      });
    }
  }

  const blogPath = "packages/data/src/fixtures/website/blog.json";
  const showcasePath = "packages/data/src/fixtures/website/showcase.json";
  const blog = JSON.parse(readText(blogPath)) as { posts?: unknown[] };
  const showcase = JSON.parse(readText(showcasePath)) as { projects?: unknown[] };
  if ((blog.posts ?? []).length !== 3) {
    addIssue(issues, {
      level: "error",
      code: "BLOG_POST_COUNT",
      message: `Expected exactly 3 blog posts, got ${(blog.posts ?? []).length}.`,
      path: blogPath,
    });
  }
  if ((showcase.projects ?? []).length !== 3) {
    addIssue(issues, {
      level: "error",
      code: "SHOWCASE_PROJECT_COUNT",
      message: `Expected exactly 3 showcase projects, got ${(showcase.projects ?? []).length}.`,
      path: showcasePath,
    });
  }

  const termsRegex = new RegExp(`\\b(${forbiddenTerms.join("|")})\\b`, "i");
  const scanPaths = Array.from(
    new Set([...criticalContentPaths, ...collectFiles("packages/data/src/fixtures/website")])
  );
  for (const relPath of scanPaths) {
    if (!existsSync(join(repoRoot, relPath))) continue;
    const content = readText(relPath);
    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      if (!termsRegex.test(line)) continue;
      addIssue(issues, {
        level: "error",
        code: "FORBIDDEN_LEGACY_TERM",
        message: `Forbidden legacy term detected in ${relPath}:${index + 1}`,
        path: relPath,
      });
      break;
    }
  }

  mkdirSync(reportsDir, { recursive: true });
  const reportPath = join(reportsDir, `invariants-${runId}.json`);
  const report = {
    runId,
    generatedAt: new Date().toISOString(),
    errors: issues.filter((item) => item.level === "error"),
    warnings: issues.filter((item) => item.level === "warn"),
  };
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");

  console.log(`Invariant report: ${relative(repoRoot, reportPath).replace(/\\/g, "/")}`);
  console.log(`Errors: ${report.errors.length}`);
  console.log(`Warnings: ${report.warnings.length}`);

  if (report.errors.length > 0) {
    for (const issue of report.errors) {
      console.error(`[${issue.code}] ${issue.message}`);
    }
    process.exit(1);
  }
}

main();
