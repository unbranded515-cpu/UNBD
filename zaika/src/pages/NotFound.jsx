import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="bg-cream py-28">
      <div className="container-x flex flex-col items-center gap-6 text-center">
        <p className="font-serif text-6xl font-bold text-forest">404</p>
        <h1 className="text-2xl font-bold text-ink">Page not found</h1>
        <p className="max-w-md text-ink/70">
          The page you’re looking for has wandered off. Let’s get you back to
          something delicious.
        </p>
        <Link to="/" className="btn-primary">
          Back Home
        </Link>
      </div>
    </section>
  )
}
