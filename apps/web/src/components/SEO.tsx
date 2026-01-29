import { useDocumentHead } from '@/hooks/useDocumentHead'

type SEOProps = {
  title: string
  description?: string
}

export function SEO({ title, description }: SEOProps) {
  useDocumentHead({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website'
  })

  return null
}

type BreadcrumbItem = {
  name: string
  url?: string
}

export function BreadcrumbJSONLD({ items }: { items: BreadcrumbItem[] }) {
  const itemListElement = items.map((it, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: it.name,
    item: it.url || undefined,
  }))

  const json = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
