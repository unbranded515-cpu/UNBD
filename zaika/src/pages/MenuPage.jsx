import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { menu, menuCategories, formatPrice } from '../data/menu'
import { orderOnlineUrl } from '../data/site'
import PageHeader from '../components/ui/PageHeader'

// Full menu page — tabbed / filterable.
//
// Category names render as clickable tabs across the top. Clicking a tab shows
// only that category's items below; switching tabs swaps content while the page
// layout stays fixed. The SAME layout applies to every category (no category
// defaults to a different layout).
//
// NOTE(pre-launch): all prices are estimates and MUST be verified against the
// current in-store menu before launch (see data/menu.js). Item descriptions
// are intentionally blank for now and render only once filled in.
export default function MenuPage() {
  const [active, setActive] = useState(menuCategories[0])
  const items = menu[active]

  return (
    <>
      <PageHeader
        eyebrow="Our Menu"
        title="Taste The Best"
        subtitle="From special snacks and momos to biryani, mains and shakes — explore everything Zaika on the Bay has to offer. Pick a category to browse."
      />

      <section className="bg-cream py-14 sm:py-16">
        <div className="container-x">
          {/* Tab bar — horizontally scrollable on mobile, wraps on larger screens. */}
          <div
            role="tablist"
            aria-label="Menu categories"
            className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0"
          >
            {menuCategories.map((category) => {
              const isActive = category === active
              return (
                <button
                  key={category}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(category)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'border-forest bg-forest text-cream'
                      : 'border-cream-300 bg-cream-100 text-ink/70 hover:border-forest/40 hover:text-forest'
                  }`}
                >
                  {category}
                </button>
              )
            })}
          </div>

          {/* Items grid — layout is identical for every category. */}
          <div className="mt-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-forest">
                  {active}
                  <span className="h-px flex-1 bg-cream-300" />
                  <span className="text-sm font-medium text-ink/50">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </h2>

                <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
                  {items.map((dish) => (
                    <li
                      key={dish.name}
                      className="flex flex-col gap-1 border-b border-dashed border-cream-300 pb-4"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-base font-semibold text-ink">{dish.name}</h3>
                        {/* leader dots */}
                        <span className="mx-2 hidden flex-1 translate-y-[-3px] border-b border-dotted border-cream-300 sm:block" />
                        <span className="whitespace-nowrap font-semibold text-forest">
                          {formatPrice(dish.price)}
                        </span>
                      </div>
                      {/* Description renders only when filled in later. */}
                      {dish.desc && (
                        <p className="max-w-prose text-sm leading-relaxed text-ink/60">
                          {dish.desc}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Price disclaimer + order CTA */}
          <div className="mt-14 flex flex-col items-center gap-5 rounded-2xl bg-cream-200 p-8 text-center">
            <p className="max-w-2xl text-sm text-ink/60">
              Prices and availability are subject to change. Please confirm with the
              restaurant when ordering.
            </p>
            <a
              href={orderOnlineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Order Online
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
