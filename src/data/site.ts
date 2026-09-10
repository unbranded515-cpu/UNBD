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

// AI-generated stand-in imagery, hotlinked from the generator's CDN.
// TO SWAP FOR REAL PHOTOS: drop a file into /public/images and change the
// matching URL below to a local path, e.g. '/images/hero.jpg'. If any URL
// ever fails to load, the site falls back to the labelled placeholder box.
const IMG = 'https://d8j0ntlcm91z4.cloudfront.net/user_34LqZFYxxERGB6v84OdOWgYjVrf/';
export const images = {
  hero: IMG + 'hf_20260910_031547_075d580e-ea85-4a58-909a-8622e82239e6.png',
  og: IMG + 'hf_20260910_031817_ad4c7b01-ce0c-4c6c-a839-cf0288fbcdfe.png',
  categories: {
    sofas: IMG + 'hf_20260910_031547_72ae1c86-d30e-474b-88c2-c4eb066b938f.png',
    beds: IMG + 'hf_20260910_031547_ad3a8c93-3160-49bc-b3fe-a4bb55f79ceb.png',
    mattresses: IMG + 'hf_20260910_031547_a52126fc-95b2-405a-951c-350863d59082.png',
    dining: IMG + 'hf_20260910_031547_1e97b804-2064-4fdd-b15b-4ca6aab31425.png',
    clearance: IMG + 'hf_20260910_031547_9b265ddb-81ea-43c5-adaa-2ff0a55f7e9b.png',
    custom: IMG + 'hf_20260910_031547_039d8da8-dc57-4eab-a108-3ab9c7b0f66b.png',
  },
  customWorkshop: IMG + 'hf_20260910_031547_bff27989-6546-44b5-812b-bffd59b95e8b.png',
  customSwatches: IMG + 'hf_20260910_031547_a6c06cb5-961a-4fa3-b383-b5bd4b4bee63.png',
  showroom: IMG + 'hf_20260910_031547_3477ef5b-79cb-44ab-9e48-02f5b358084c.png',
  instagram: [
    IMG + 'hf_20260910_031547_c0214e69-2bb5-4965-8137-3426567a92ea.png',
    IMG + 'hf_20260910_031547_905378a8-25c8-47d4-a83f-76742905dcc5.png',
    IMG + 'hf_20260910_031817_a1b9f04c-1b9b-4c61-82a3-5d11fe5a64fc.png',
    IMG + 'hf_20260910_031817_22a0b4ea-9e0e-4cac-b8ee-bb35f176c2ba.png',
  ],
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
