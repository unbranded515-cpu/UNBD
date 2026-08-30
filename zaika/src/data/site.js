// =============================================================================
// Central site content / config for Zaika on the Bay.
// Keep ALL copy, contact details, hours, links and toggles here so content
// can be updated without touching layout components.
// =============================================================================

export const brand = {
  name: 'Zaika on the Bay',
  handle: '@zaikaonthebay',
  tagline: 'Authentic Indian & Global Snacks, Belleville’s Own',
  // Google rating badge (verify against the live Google listing before launch).
  rating: { score: 4.4, count: 300 },
}

export const contact = {
  address: {
    line1: '37 Pinnacle St',
    city: 'Belleville',
    province: 'ON',
    postal: 'K8N 3A1',
    country: 'Canada',
  },
  // Primary phone shown in the nav; secondary is an alternate line.
  phonePrimary: '(613) 779-1115',
  phoneSecondary: '(647) 327-5086',
  email: 'Zaikaonthebay2025@gmail.com',
  // Google Maps directions link (uses the street address).
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=37+Pinnacle+St+Belleville+ON+K8N+3A1',
}

export const social = {
  instagram: { label: '@zaikaonthebay', url: 'https://www.instagram.com/zaikaonthebay' },
  // Facebook URL to be confirmed — placeholder to the search until the real page is provided.
  facebook: { label: 'Facebook', url: 'https://www.facebook.com/' },
}

// Opening hours — order matters for display.
export const hours = [
  { day: 'Sunday', time: '12:00 PM – 11:00 PM' },
  { day: 'Monday', time: '11:00 AM – 10:00 PM' },
  { day: 'Tuesday', time: '11:00 AM – 10:00 PM' },
  { day: 'Wednesday', time: '11:00 AM – 10:00 PM' },
  { day: 'Thursday', time: '11:00 AM – 10:00 PM' },
  { day: 'Friday', time: '11:00 AM – 11:00 PM' },
  { day: 'Saturday', time: '12:00 PM – 11:00 PM' },
]

// Primary navigation links.
export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'About Us', to: '/about' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Contact Us', to: '/contact' },
]

// -----------------------------------------------------------------------------
// Order Online / delivery partners.
// TODO(pre-launch): replace `#` with the restaurant's real store URLs on each
// platform once confirmed.
// -----------------------------------------------------------------------------
export const orderOnlineUrl = '#' // primary "Order Online" CTA target (TBD)

export const deliveryPartners = [
  { name: 'Uber Eats', url: '#' },
  { name: 'Skip The Dishes', url: '#' },
  { name: 'DoorDash', url: '#' },
]

// -----------------------------------------------------------------------------
// Service offerings row.
// NOTE(client): confirm which of these actually apply before launch —
// specifically whether Zaika offers dine-in / reservations, or is
// takeout + delivery only. Built generically; toggle `enabled` per item.
// -----------------------------------------------------------------------------
export const services = [
  {
    key: 'takeout',
    title: 'Takeout',
    description: 'Order ahead and pick up fresh, hot and ready at 37 Pinnacle St.',
    icon: 'bag',
    enabled: true,
  },
  {
    key: 'delivery',
    title: 'Delivery',
    description: 'Brought to your door via Uber Eats, Skip The Dishes and DoorDash.',
    icon: 'scooter',
    enabled: true,
  },
  {
    key: 'dinein',
    title: 'Dine-In',
    description: 'Pull up a chair and enjoy your meal with us, steps from the bay.',
    icon: 'utensils',
    enabled: true, // TODO(client): confirm dine-in is offered before launch.
  },
]

// Welcome / About blurb (used on Home and About page).
export const about = {
  eyebrow: 'Welcome to Zaika on the Bay',
  // Headline is split so the key phrase can be highlighted in forest green.
  headlineLead: 'Bringing You Bold Indian Flavour,',
  headlineHighlight: 'Right on the Bay',
  body: [
    'Zaika on the Bay opened its doors in July 2025, proudly owned and run by Belleville residents who wanted to share the food they grew up loving with their own community.',
    'We blend authentic, homestyle Indian dishes with the global snacks people crave — steamed and fried momos, sizzling Indo-Chinese, stacked burgers and hand-rolled wraps — all made fresh to order.',
    'Find us just steps from the bay’s scenic waterfront in downtown Belleville. Whether you’re grabbing a quick bite or feeding the whole family, there’s a seat and a plate here for you.',
  ],
}

// Experience section feature blocks.
export const experience = {
  eyebrow: 'Delight Your Palate',
  headline: 'Experience Bold, Homestyle Indian Cooking',
  features: [
    {
      title: 'Authentic Recipes',
      description:
        'Traditional spices and techniques passed down through generations — the real, honest flavours of home.',
      icon: 'flame',
    },
    {
      title: 'Best of Both Worlds',
      description:
        'Classic Indian mains alongside global street-food favourites like momos and Indo-Chinese — something for every craving.',
      icon: 'globe',
    },
  ],
}

// Testimonials — placeholder quotes. TODO(pre-launch): swap in real Google reviews.
export const testimonials = [
  {
    quote:
      'The malai momos are unreal and the butter chicken tastes just like home. So happy to have a spot like this on the bay.',
    author: 'Placeholder Review',
    location: 'Belleville, ON',
  },
  {
    quote:
      'Fresh, generous portions and so much variety — from biryani to Indo-Chinese. Our new go-to for takeout.',
    author: 'Placeholder Review',
    location: 'Belleville, ON',
  },
  {
    quote:
      'Warm, friendly service and bold flavours. The chaat and wraps are a must-try. Highly recommend!',
    author: 'Placeholder Review',
    location: 'Belleville, ON',
  },
]
