const restaurantSchema = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'Moor Hall',
  image: 'https://moorhallrestaurant.com/logo.png',
  url: 'https://moorhallrestaurant.com',
  telephone: '+250788658316',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '25M6+9VF, Kigali',
    addressLocality: 'Kigali',
    addressRegion: 'Gasabo',
    postalCode: '',
    addressCountry: 'RW',
  },
  servesCuisine: ['International', 'Cafe', 'Bakery'],
  priceRange: 'RWF',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '06:00',
      closes: '00:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '06:00',
      closes: '02:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday'],
      opens: '06:00',
      closes: '01:00',
    },
  ],
  acceptsReservations: true,
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', 'name': 'Catering services' },
    { '@type': 'LocationFeatureSpecification', 'name': 'Coffee shop' },
    { '@type': 'LocationFeatureSpecification', 'name': 'Bakery' },
  ],
  description:
    'Moor Hall offers exceptional dining, specialty coffee, fresh bakery, and tailored catering for memorable events.',
}

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
    />
  )
}
