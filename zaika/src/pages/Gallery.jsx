import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import Placeholder from '../components/ui/Placeholder'

// Gallery page — grid of placeholder tiles.
// To publish real photos: replace this array with imported assets / URLs and
// map them into the grid (each tile is a one-line `src` change).
const galleryItems = [
  { label: 'Momos', ratio: 'aspect-square' },
  { label: 'Biryani', ratio: 'aspect-square' },
  { label: 'Chaat', ratio: 'aspect-square' },
  { label: 'Tandoori', ratio: 'aspect-square' },
  { label: 'Indo-Chinese', ratio: 'aspect-square' },
  { label: 'Wraps', ratio: 'aspect-square' },
  { label: 'Desserts', ratio: 'aspect-square' },
  { label: 'Shakes', ratio: 'aspect-square' },
]

export default function Gallery() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="A Taste of Zaika"
        subtitle="A peek at the food and the space. Real photography coming soon — check back, or follow us on Instagram."
      />

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {galleryItems.map((tile, i) => (
              <Reveal key={tile.label} delay={(i % 4) * 0.06}>
                <div className="group relative overflow-hidden rounded-xl">
                  <Placeholder
                    alt={tile.label}
                    label={tile.label}
                    ratio={tile.ratio}
                    rounded="rounded-xl"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
