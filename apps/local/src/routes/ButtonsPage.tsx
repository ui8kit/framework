import { Block, Container, Group, Stack, Text, Title, Button } from "@ui8kit/core";
import { dataClasses } from "@/lib/data-classes";

function CodeTextarea({ value, rows = 6 }: { value: string; rows?: number }) {
  return (
    <textarea
      readOnly
      rows={rows}
      value={value}
      data-class="code-textarea"
      className="w-full text-sm bg-muted border border-border rounded p-4 leading-relaxed"
    />
  );
}

export function ButtonsPage() {
  const reactSnippet = `import { Button } from "@ui8kit/core";
import { dataClasses } from "@/lib/data-classes";

export function Example() {
  return (
    <Button
      variant="primary"
      size="lg"
      data-classes={dataClasses("button-primary", "button-lg")}
    >
      Primary
    </Button>
  );
}`;

  const htmlClasses = "button button-primary button-lg";
  const liquidSnippet = `<button class="${htmlClasses}">Primary</button>`;
  const htmlSnippet = `<button type="button" class="${htmlClasses}">Primary</button>`;

  return (
    <Container data-class="buttons-page">
      <Stack gap="6" py="8" data-class="buttons-page-stack">
        <Block component="header" data-class="buttons-header">
          <Stack gap="2">
            <Title order={1} text="3xl" data-class="buttons-title">
              Buttons
            </Title>
            <Text bg="muted-foreground" data-class="buttons-subtitle">
              React component demos with copy-ready Liquid / HTML snippets (no JS).
            </Text>
          </Stack>
        </Block>

        <Block component="section" data-class="buttons-demo">
          <Stack gap="4">
            <Title order={2} text="xl" data-class="buttons-demo-title">
              Demo stack
            </Title>

            <Group gap="4" flex="wrap" data-class="buttons-demo-row">
              <Button>Default</Button>
              <Button variant="primary" data-classes="button-primary">
                Primary
              </Button>
              <Button variant="secondary" data-classes="button-secondary">
                Secondary
              </Button>
              <Button variant="outline" data-classes="button-outline">
                Outline
              </Button>
              <Button variant="ghost" data-classes="button-ghost">
                Ghost
              </Button>
              <Button variant="link" data-classes="button-link">
                Link
              </Button>
              <Button variant="destructive" data-classes="button-destructive">
                Destructive
              </Button>
            </Group>

            <Group gap="4" flex="wrap" data-class="buttons-demo-row-sizes">
              <Button size="xs" data-classes="button-xs">
                XS
              </Button>
              <Button size="sm" data-classes="button-sm">
                SM
              </Button>
              <Button size="default">Default</Button>
              <Button size="lg" data-classes="button-lg">
                LG
              </Button>
              <Button size="xl" data-classes="button-xl">
                XL
              </Button>
            </Group>

            <Block data-class="buttons-focus-example">
              <Text bg="muted-foreground">
                Note: in React you typically only pass variant tokens via{" "}
                <Text component="code" bg="secondary-foreground">
                  data-classes
                </Text>{" "}
                because the base{" "}
                <Text component="code" bg="secondary-foreground">
                  button
                </Text>{" "}
                token comes from the component&apos;s{" "}
                <Text component="code" bg="secondary-foreground">
                  data-class=&quot;button&quot;
                </Text>
                .
              </Text>
            </Block>
          </Stack>
        </Block>

        {/* CSS-only tabs (no JS) */}
        <div
          data-class="tabs"
          className="w-full border border-border rounded-lg bg-background"
        >
          <input
            id="tabs-react"
            name="buttons-tabs"
            type="radio"
            defaultChecked
            data-class="tabs-radio"
          />
          <label
            htmlFor="tabs-react"
            data-class="tabs-label"
          >
            React
          </label>

          <input
            id="tabs-liquid"
            name="buttons-tabs"
            type="radio"
            data-class="tabs-radio"
          />
          <label
            htmlFor="tabs-liquid"
            data-class="tabs-label"
          >
            Liquid
          </label>

          <input
            id="tabs-html"
            name="buttons-tabs"
            type="radio"
            data-class="tabs-radio"
          />
          <label
            htmlFor="tabs-html"
            data-class="tabs-label"
          >
            HTML
          </label>

          <div data-class="tabs-panels" className="p-4">
            <section data-panel="react" data-class="tabs-panel">
              <Stack gap="4">
                <Title order={3} text="lg" data-class="tabs-panel-title">
                  React
                </Title>
                <Text bg="muted-foreground">
                  Copy this JSX and keep using the core component API.
                </Text>
                <CodeTextarea value={reactSnippet} rows={10} />
              </Stack>
            </section>

            <section data-panel="liquid" data-class="tabs-panel">
              <Stack gap="4">
                <Title order={3} text="lg" data-class="tabs-panel-title">
                  Liquid
                </Title>
                <Text bg="muted-foreground">
                  Copy the semantic classes directly into a{" "}
                  <Text component="code" bg="secondary-foreground">
                    .liquid
                  </Text>{" "}
                  template.
                </Text>
                <CodeTextarea value={liquidSnippet} rows={4} />
              </Stack>
            </section>

            <section data-panel="html" data-class="tabs-panel">
              <Stack gap="4">
                <Title order={3} text="lg" data-class="tabs-panel-title">
                  HTML
                </Title>
                <Text bg="muted-foreground">
                  Same result as Liquid, but as plain HTML.
                </Text>
                <CodeTextarea value={htmlSnippet} rows={4} />
              </Stack>
            </section>
          </div>
        </div>
      </Stack>
    </Container>
  );
}

