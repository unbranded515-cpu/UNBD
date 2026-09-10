// Central brand facts. Edit these once and every page updates.
export const site = {
  name: 'Diamond Sofas MFG',
  shortName: 'Diamond Sofa',
  phone: '647-210-9552',
  phoneHref: 'tel:+16472109552',
  email: 'diamondsofasmfg@gmail.com',
  instagram: '@diamondsofasmfg',
  instagramUrl: 'https://www.instagram.com/diamondsofasmfg/',
  domain: 'diamondsofasmfg.com',
  url: 'https://diamondsofasmfg.com',
  address: {
    line: 'Unit 15, 1325 Centennial Drive',
    city: 'Kingston',
    province: 'ON',
    postal: '',
    full: 'Unit 15, 1325 Centennial Drive, Kingston, ON',
    directions: 'Off Exit 611 from the 401',
  },
  // Google Maps directions link to the showroom.
  mapsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('Diamond Sofas MFG, Unit 15, 1325 Centennial Drive, Kingston, ON'),
  // Embed used on showroom / home map blocks.
  mapEmbedUrl:
    'https://www.google.com/maps?q=' +
    encodeURIComponent('1325 Centennial Drive, Kingston, ON') +
    '&output=embed',
  hours: 'Open 7 days a week',
  geo: {
    // Approximate coordinates for Centennial Drive, Kingston, ON.
    // Update with exact showroom coordinates when confirmed.
    latitude: 44.2634,
    longitude: -76.5607,
  },
};

// Primary navigation used by the header and footer.
export const nav = [
  { label: 'Sofas', href: '/sofas' },
  { label: 'Beds', href: '/beds' },
  { label: 'Mattresses', href: '/mattresses' },
  { label: 'Dining', href: '/dining' },
  { label: 'Clearance', href: '/clearance' },
  { label: 'Custom', href: '/custom' },
  { label: 'Showroom', href: '/showroom' },
];
