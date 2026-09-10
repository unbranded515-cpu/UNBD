import { useState } from 'react'
import { cateringBudgets, contact } from '../data/site'

// Catering inquiry form. There's no backend on this static site, so submitting
// opens the visitor's email app with all the details (including their budget)
// pre-filled to the restaurant. Swap `handleSubmit` for a real form endpoint
// (Formspree, Netlify Forms, etc.) later if you want inquiries stored.
const initial = {
  name: '',
  email: '',
  phone: '',
  eventDate: '',
  guests: '',
  budget: '',
  details: '',
}

export default function CateringForm() {
  const [form, setForm] = useState(initial)

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const subject = `Catering inquiry — ${form.name || 'New inquiry'}`
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Event date: ${form.eventDate}`,
      `Number of guests: ${form.guests}`,
      `Budget: ${form.budget}`,
      '',
      'Details:',
      form.details,
    ].join('\n')
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`
  }

  const field =
    'w-full rounded-lg border border-cream-300 bg-cream-100 px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-forest focus:ring-1 focus:ring-forest'
  const label = 'mb-1.5 block text-sm font-medium text-ink/80'

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className={label} htmlFor="cat-name">Name</label>
        <input id="cat-name" name="name" value={form.name} onChange={update} required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="cat-email">Email</label>
        <input id="cat-email" type="email" name="email" value={form.email} onChange={update} required className={field} />
      </div>
      <div>
        <label className={label} htmlFor="cat-phone">Phone</label>
        <input id="cat-phone" type="tel" name="phone" value={form.phone} onChange={update} className={field} />
      </div>
      <div>
        <label className={label} htmlFor="cat-date">Event date</label>
        <input id="cat-date" type="date" name="eventDate" value={form.eventDate} onChange={update} className={field} />
      </div>
      <div>
        <label className={label} htmlFor="cat-guests">Number of guests</label>
        <input id="cat-guests" type="number" min="1" name="guests" value={form.guests} onChange={update} className={field} />
      </div>
      <div>
        <label className={label} htmlFor="cat-budget">Your budget</label>
        <select id="cat-budget" name="budget" value={form.budget} onChange={update} required className={field}>
          <option value="" disabled>Select a budget range</option>
          {cateringBudgets.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="cat-details">Tell us about your event</label>
        <textarea id="cat-details" name="details" value={form.details} onChange={update} rows={4} className={field} placeholder="Occasion, menu preferences, delivery or pickup, dietary needs…" />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary w-full sm:w-auto">Send Catering Inquiry</button>
        <p className="mt-3 text-xs text-ink/55">
          This opens your email app with the details filled in. Prefer to call?{' '}
          <a href={`tel:${contact.phonePrimary.replace(/[^\d+]/g, '')}`} className="font-medium text-forest hover:underline">
            {contact.phonePrimary}
          </a>
        </p>
      </div>
    </form>
  )
}
