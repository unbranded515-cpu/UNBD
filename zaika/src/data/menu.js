// =============================================================================
// Menu data for Zaika on the Bay.
//
// IMPORTANT — PRICE VERIFICATION:
// The prices below are best-available ESTIMATES from prior research. They MUST
// be verified against the current in-store menu before launch. Do not treat
// them as final. Each item also has an (empty) `desc` field ready for short
// descriptions to be filled in later.
// =============================================================================

// Helper: normalise seed rows ({ name, price }) into full item objects with a
// description slot. Keeps the source data below terse and easy to edit.
const item = (name, price, desc = '') => ({ name, price, desc })

// Ordered so the tab order on the menu page reads naturally.
export const menu = {
  'Special Snacks': [
    item('Aloo Puff', 2.5),
    item('Paneer Puff', 2.99),
    item('Samosa', 2.99),
    item('Papdi Chaat', 8.99),
    item('Aloo Fries', 6.99),
    item('Samosa Chaat', 9.99),
    item('Tikki Chaat', 9.99),
    item('Dahi Bhalla', 8.99),
    item('Mix Veg Pakora', 8.99),
    item('Crunchy Fried Chicken', 13.99),
    item('Veg Platter', 14.99),
    item('Chicken Pakora', 13.99),
    item('Crunchy Fried Fish', 15.99),
    item('Tandoori Chicken', 14.99),
    item('Mango Chicken', 14.99),
    item('Hara Bhara Paneer', 13.99),
    item('Paneer Tikka', 14.99),
    item('Tandoori Prawns', 16.99),
    item('Tandoori Fish', 16.99),
  ],
  'Special Momos': [
    item('Veg Steamed Momo', 11.99),
    item('Veg Fried Momo', 12.99),
    item('Chicken Steamed Momo', 12.99),
    item('Chicken Fried Momo', 13.99),
    item('Paneer Steamed Momo', 12.99),
    item('Paneer Fried Momo', 13.99),
    item('Chilli Momo (Veg)', 13.99),
    item('Chilli Momo (Non Veg)', 14.99),
    item('Malai Momo (Veg)', 14.99),
    item('Malai Momo (Non Veg)', 15.99),
  ],
  'Special Burgers': [
    item('Aloo Tikki Burger', 7.99),
    item('Aloo Tikki Noodle Burger', 8.99),
  ],
  'Special Indo-Chinese': [
    item('Spring Rolls', 7.99),
    item('Hakka Noodles', 10.99),
    item('Veg Manchurian', 10.99),
    item('Chilli Cheese', 9.99),
    item('Chicken Manchurian', 12.99),
    item('Chicken 65', 12.99),
    item('Veg Fried Rice', 9.99),
    item('Chicken Fried Rice', 11.99),
    item('Chilli Chicken', 12.99),
  ],
  'Special Wraps': [
    item('Aloo Masala Wrap', 9.99),
    item('Paneer Masala Wrap', 10.99),
    item('Chicken Tikka Masala Wrap', 11.99),
    item('Butter Chicken Wrap', 11.99),
    item('Korma Chicken Roll', 11.99),
  ],
  'Special Chaaps': [
    item('Tandoori Chaap', 12.99),
    item('Malai Chaap', 12.99),
    item('Achari Soya Chaap', 12.99),
  ],
  'Special Pasta': [
    item('White Sauce Pasta', 12.99),
    item('Red Sauce Pasta', 12.99),
  ],
  'Main Course': [
    item('Dal Makhani', 12.99),
    item('Channa Masala', 12.99),
    item('Paneer Makhani', 14.99),
    item('Shahi Paneer', 14.99),
    item('Butter Chicken', 15.99),
    item('Punjabi Style Chicken', 15.99),
    item('Kadhai Paneer', 14.99),
    item('Chicken Tikka Masala', 15.99),
    item('Goat Curry', 17.99),
    item('Fish Tikka Masala', 16.99),
  ],
  'Special Breads': [
    item('Plain Naan', 2.99),
    item('Garlic Naan', 3.99),
    item('Butter Naan', 3.99),
    item('Roti', 2.99),
    item('Onion Kulcha', 4.99),
    item('Amritsari Kulcha', 10.99),
    item('Lacha Parantha', 4.99),
    item('Missi Roti', 3.99),
    item('Garlic and Basil Naan', 4.99),
  ],
  'Rice Sides': [
    item('Jeera Rice', 3.99),
    item('Rice Bowl Combo', 12.99),
    item('Chicken Biryani', 14.99),
  ],
  'Cold Beverages & Shakes': [
    item('Pop', 1.99),
    item('Sweet Lassi', 4.99),
    item('Salted Lassi', 4.99),
    item('Virgin Mojito', 5.99),
    item('Oreo Milkshake', 5.99),
    item('Nutella Milkshake', 5.99),
    item('Biscoff Milkshake', 5.99),
    item('Falooda', 5.99),
  ],
  'Hot Beverages': [
    item('Madras Coffee', 2.5),
    item('Masala Tea', 2.5),
    item('Elaichi Tea', 2.5),
  ],
  Desserts: [
    item('Gulab Jamun', 3.99),
    item('Ras Malai', 3.99),
  ],
  'Combo Meals': [
    item('Parantha Combo', 10.99),
    item('Combo Meal', 13.99),
  ],
}

// Category names in display order (drives the menu-page tab bar).
export const menuCategories = Object.keys(menu)

// Home-page "Menu Highlights" — three featured dishes.
// `image` is null for now → renders a styled placeholder. Swapping in a real
// photo later is a one-line change (set `image` to an imported asset / URL).
export const menuHighlights = [
  { name: 'Tandoori Fish', price: 16.99, image: null },
  { name: 'Malai Momo (Non Veg)', price: 15.99, image: null },
  { name: 'Chicken Biryani', price: 14.99, image: null },
]

// Consistent price formatting helper (CAD).
export const formatPrice = (value) => `$${value.toFixed(2)}`
