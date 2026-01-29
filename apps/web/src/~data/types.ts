export interface PageData {
  title: string;
  excerpt: string;
  content: string;
}

export interface Feature {
  id: number;
  title: string;
  excerpt: string;
  featuredImage: {
    url: string;
    alt: string;
    caption: string;
  };
}

export interface AboutData {
  page: PageData;
  features: Feature[];
  }

// For other pages
export interface HomeData {
  page: PageData;
  features: Feature[];
}

export interface ArchiveData {
  page: PageData;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
}