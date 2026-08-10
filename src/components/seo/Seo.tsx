import { useEffect } from 'react'

type SeoProps = {
  title?: string
  description?: string
  path?: string
  keywords?: string
  image?: string
  type?: string
}

const defaultTitle = 'Moor Hall | Restaurant, Coffee & Catering'
const defaultDescription =
  'Moor Hall offers exceptional dining, specialty coffee, fresh bakery, and tailored catering for memorable events.'
const defaultKeywords =
  'Moor Hall restaurant, catering, coffee shop, bakery, fine dining, events, reservations'
const siteUrl = 'https://moorhallrestaurant.com'
const defaultImage = '/logo.png'

const upsertMeta = (attributes: Record<string, string>) => {
  const key = attributes.name ? 'name' : 'property'
  const selector = attributes.name
    ? `meta[name="${attributes.name}"]`
    : `meta[property="${attributes.property}"]`

  let element = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([attribute, value]) => {
    element?.setAttribute(attribute, value)
  })

  if (!attributes.name && !attributes.property) {
    element.setAttribute(key, '')
  }
}

export default function Seo({
  title = defaultTitle,
  description = defaultDescription,
  path = '/',
  keywords = defaultKeywords,
  image = defaultImage,
  type = 'website',
}: SeoProps) {
  useEffect(() => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const fullTitle = title.includes('Moor Hall') ? title : `${title} | Moor Hall`

    document.title = fullTitle

    upsertMeta({ name: 'description', content: description })
    upsertMeta({ name: 'keywords', content: keywords })
    upsertMeta({ name: 'robots', content: 'index,follow' })
    upsertMeta({ name: 'author', content: 'Moor Hall' })
    upsertMeta({ name: 'theme-color', content: '#0f172a' })

    upsertMeta({ property: 'og:title', content: fullTitle })
    upsertMeta({ property: 'og:description', content: description })
    upsertMeta({ property: 'og:type', content: type })
    upsertMeta({ property: 'og:image', content: `${siteUrl}${image}` })
    upsertMeta({ property: 'og:url', content: `${siteUrl}${normalizedPath}` })

    upsertMeta({ name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta({ name: 'twitter:title', content: fullTitle })
    upsertMeta({ name: 'twitter:description', content: description })
    upsertMeta({ name: 'twitter:image', content: `${siteUrl}${image}` })

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }

    canonical.setAttribute('href', `${siteUrl}${normalizedPath}`)
  }, [title, description, path, keywords, image, type])

  return null
}
