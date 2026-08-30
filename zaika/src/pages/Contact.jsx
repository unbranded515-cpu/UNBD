import { contact, hours, orderOnlineUrl, social } from '../data/site'
import PageHeader from '../components/ui/PageHeader'
import Reveal from '../components/ui/Reveal'
import Icon from '../components/ui/Icon'

// Google Maps embed for the address (no API key needed for this embed form).
const mapSrc =
  'https://www.google.com/maps?q=37+Pinnacle+St+Belleville+ON+K8N+3A1&output=embed'

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="Come Visit Us"
        subtitle="We’re at 37 Pinnacle St in downtown Belleville, steps from the bay. Call ahead, order online, or drop by."
      />

      <section className="bg-cream py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          {/* Details */}
          <Reveal className="space-y-8">
            <div className="space-y-5">
              <ContactRow icon="pin" title="Address">
                <a
                  href={contact.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-forest"
                >
                  {contact.address.line1}, {contact.address.city}, {contact.address.province}{' '}
                  {contact.address.postal}
                </a>
              </ContactRow>

              <ContactRow icon="phone" title="Phone">
                <span className="flex flex-col">
                  <a href={`tel:${contact.phonePrimary.replace(/[^\d+]/g, '')}`} className="hover:text-forest">
                    {contact.phonePrimary}
                  </a>
                  <a href={`tel:${contact.phoneSecondary.replace(/[^\d+]/g, '')}`} className="hover:text-forest">
                    {contact.phoneSecondary}
                  </a>
                </span>
              </ContactRow>

              <ContactRow icon="mail" title="Email">
                <a href={`mailto:${contact.email}`} className="break-all hover:text-forest">
                  {contact.email}
                </a>
              </ContactRow>

              <ContactRow icon="instagram" title="Social">
                <a
                  href={social.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-forest"
                >
                  {social.instagram.label}
                </a>
              </ContactRow>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a href={orderOnlineUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Order Online
              </a>
              <a href={contact.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
                Get Directions
              </a>
            </div>

            {/* Hours */}
            <div className="rounded-2xl border border-cream-300 bg-cream-100 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-forest">
                <Icon name="clock" size={20} /> Opening Hours
              </h3>
              <ul className="space-y-2 text-sm">
                {hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4">
                    <span className="text-ink/70">{h.day}</span>
                    <span className="font-medium text-ink">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal delay={0.1}>
            <div className="h-full min-h-[24rem] overflow-hidden rounded-2xl border border-cream-300 shadow-sm">
              <iframe
                title="Map to Zaika on the Bay"
                src={mapSrc}
                className="h-full min-h-[24rem] w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function ContactRow({ icon, title, children }) {
  return (
    <div className="flex gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-cream">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-ink/50">{title}</p>
        <div className="mt-1 text-base text-ink/80">{children}</div>
      </div>
    </div>
  )
}
