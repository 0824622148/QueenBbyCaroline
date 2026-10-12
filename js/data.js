/* Queen B by Caroline's — site content.
   Demo data only: prices, durations and products are placeholders until confirmed by the salon. */
window.QB = {
  contact: {
    address: ['277 Columbine Avenue', 'Mondeor, Johannesburg'],
    phones: ['071 567 8660', '079 028 7023']
  },

  nav: [
    ['Home', '#home'], ['About', '#about'], ['Services', '#services'],
    ['Lookbook', '#lookbook'], ['Shop', '#shop'], ['Contact', '#contact']
  ],

  stories: [
    ['Hair Transformations', 'hair-splitsun.jpg', '50% 30%', '#lookbook'],
    ['Nail Art', 'nails-burgundy.jpg', '50% 45%', '#lookbook'],
    ['Client Love', 'teal.jpg', '50% 22%', '#lookbook'],
    ['Hair Care Tips', 'hair-ombre.jpg', '50% 40%', '#shop'],
    ['Behind the Scenes', 'styling-precision.jpg', '30% 25%', '#team'],
    ['Specials', 'hair-burgundy.jpg', '50% 30%', '#booking'],
    ['Queen B Products', 'p-shampoo.png', '50% 50%', '#shop'],
    ['Salon Life', 'salon-interior.jpg', '40% 50%', '#about']
  ],

  services: [
    { name: 'Hair', line1: 'Cuts • Styling • Colour', line2: 'Treatments • Relaxing', img: 'hair-copper.jpg', pos: '50% 35%' },
    { name: 'Nails', line1: 'Gel • Acrylic • Natural Nails', line2: 'Nail Art • Manicures', img: 'nails-glitter.jpg', pos: '50% 40%' },
    { name: 'Lashes & Beauty', line1: 'Lashes • Brows • Facials', line2: 'Beauty Treatments' },
    { name: 'Treatments', line1: 'Scalp Care • Deep Treatments', line2: 'Protein • Repairs', img: 'hair-ombre.jpg', pos: '50% 40%' }
  ],

  features: ['Experienced Stylists', 'Premium Products', 'Welcoming Atmosphere', 'All Hair Types', 'Book Online 24/7', 'Trusted by Our Community'],

  /* Booking categories: price is a number (ZAR), fromPrice marks "from R…" pricing, dur in minutes (0 = confirmed in salon) */
  categories: {
    'Hair': { from: 150, img: 'hair-sleekbob.jpg', pos: '50% 30%', list: [
      { name: 'Wash & Blow', price: 180, dur: 60 },
      { name: 'Cut & Style', price: 250, dur: 60 },
      { name: 'Colour', price: 550, dur: 120 },
      { name: 'Relaxer', price: 350, dur: 90 },
      { name: 'Hair Treatment', price: 300, dur: 60 }
    ] },
    'Nails': { from: 80, img: 'nails-burgundy.jpg', pos: '50% 40%', list: [
      { name: 'Gel', price: 80, fromPrice: true },
      { name: 'Acrylic', price: 80, fromPrice: true },
      { name: 'Natural Nails', price: 80, fromPrice: true },
      { name: 'Nail Art', price: 80, fromPrice: true },
      { name: 'Manicure', price: 80, fromPrice: true }
    ] },
    'Lashes & Beauty': { from: 100, list: [
      { name: 'Lashes', price: 100, fromPrice: true },
      { name: 'Brows', price: 100, fromPrice: true },
      { name: 'Facials', price: 100, fromPrice: true },
      { name: 'Beauty Treatments', price: 100, fromPrice: true }
    ] },
    'Treatments': { from: 120, img: 'hair-honey.jpg', pos: '50% 40%', list: [
      { name: 'Scalp Care', price: 120, fromPrice: true },
      { name: 'Deep Treatment', price: 120, fromPrice: true },
      { name: 'Protein Treatment', price: 120, fromPrice: true },
      { name: 'Repair Treatment', price: 120, fromPrice: true }
    ] }
  },

  staff: [
    { id: 'any', name: 'Any stylist', role: 'First available' },
    { id: 'bj', name: 'Billy Jean', role: 'Owner', img: 'staff-billyjean.jpg', y: '18%' },
    { id: 'lz', name: 'Elizabeth', team: 'Elizabeth “Lizzy”', role: 'Braiding Specialist', img: 'staff-elizabeth.jpg', y: '22%' },
    { id: 'la', name: 'Lee-Ann', role: 'Stylist', img: 'staff-leeann.jpg', y: '20%' },
    { id: 'pt', name: 'Patience', role: 'Pedicures, body massages, shampooist & waxing', teamRole: 'Pedicures, body massages, shampooist & wax therapist', img: 'staff-patience.jpg', y: '22%' }
  ],

  times: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'],

  products: {
    shampoo: { name: 'Moisturising Shampoo', size: '300 ml', price: 199, cat: 'Hair Care', img: 'p-shampoo.png', lg: 'p-shampoo-lg.jpg', rating: '4.9 (128)', desc: 'A gentle, sulfate-free cleanse with argan oil and keratin. Cleanses, strengthens and nourishes without stripping moisture.' },
    conditioner: { name: 'Nourishing Conditioner', size: '300 ml', price: 199, cat: 'Hair Care', img: 'p-conditioner.png', lg: 'p-conditioner-lg.jpg', rating: '4.8 (96)', desc: 'Shea butter, argan oil and vitamin E to hydrate, repair and soften every strand.' },
    mask: { name: 'Deep Treatment Mask', size: '200 ml', price: 229, cat: 'Treatments', img: 'p-mask.png', lg: 'p-mask-lg.jpg', rating: '4.9 (214)', desc: 'An intensive weekly treatment with argan oil, keratin and collagen to restore, strengthen and revitalise.' },
    oil: { name: 'Hair Oil', size: '100 ml', price: 179, cat: 'Hair Care', img: 'p-oil.png', rating: '4.8 (87)', desc: 'A lightweight finishing oil that nourishes, adds shine and protects ends.' },
    leavein: { name: 'Leave-in Conditioner', size: '200 ml', price: 189, cat: 'Hair Care', img: 'p-leavein.png', rating: '4.8 (73)', desc: 'A light spray that detangles, protects and adds shine between wash days. No rinse needed.' },
    edge: { name: 'Edge Control', size: '150 ml', price: 149, cat: 'Hair Care', img: 'p-edge.png', rating: '4.7 (65)', desc: 'Strong hold with a smooth, non-flaking finish. Made with castor oil and argan oil to care for delicate edges.' }
  },

  shopFilters: ['All', 'Hair Care', 'Treatments', 'Tools', 'Kits'],

  benefits: [
    ['Sulfate Free', 'M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5S12.5 5.5 12 3c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7Z'],
    ['Argan Oil', 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10ZM2 21c0-3 1.9-5.4 5.1-6C9.5 14.5 12 13 13 12'],
    ['All Hair Types', 'M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3Z'],
    ['Salon Quality', 'M12 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM15.5 12.9 17 22l-5-3-5 3 1.5-9.1']
  ],

  lookTabs: ['All', 'Hair', 'Nails', 'Treatments'],
  looks: [
    ['hair-splitcurls.jpg', 'Split-colour curls', 'Hair', '50% 30%'],
    ['hero.jpg', 'Ash-blonde blowout', 'Hair', '50% 25%'],
    ['nails-burgundy.jpg', 'Burgundy ombré stilettos', 'Nails', '50% 40%'],
    ['hair-ombre.jpg', 'Caramel ombré finish', 'Treatments', '50% 40%'],
    ['hair-burgundy.jpg', 'Burgundy with red ribbons', 'Hair', '50% 30%'],
    ['nails-glitter.jpg', 'Shimmer pink & chrome', 'Nails', '50% 40%'],
    ['hair-sleekbob.jpg', 'Sleek bob', 'Hair', '50% 30%'],
    ['hair-splitsun.jpg', 'Split-dye curls', 'Hair', '50% 30%'],
    ['teal.jpg', 'Teal streak', 'Hair', '50% 25%'],
    ['hair-honey.jpg', 'Honey caramel bob', 'Treatments', '50% 40%'],
    ['hair-copper.jpg', 'Glossy copper waves', 'Hair', '50% 40%'],
    ['styling-curls.jpg', 'Glossy curls in progress', 'Treatments', '50% 40%']
  ],

  delivery: { fee: 80, freeOver: 500 }
};
