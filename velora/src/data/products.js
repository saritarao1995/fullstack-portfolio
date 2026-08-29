export const CATEGORIES = ['Living', 'Dining', 'Lighting'];

export const PRODUCTS = [
  {
    id: 'linen-sofa',
    name: 'Linen Modular Sofa',
    category: 'Living',
    price: 205000,
    available: true,
    tag: 'Bestseller',
    lead: 'Cloud-soft seating in undyed Belgian linen.',
    story:
      'A low, generous silhouette designed for long evenings. Removable covers, kiln-dried oak legs, and a quiet palette that settles into any room.',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=80',
    ],
    specs: ['Belgian linen', 'Oak frame', 'Made to order · 4–6 weeks'],
  },
  {
    id: 'oak-table',
    name: 'White Oak Dining Table',
    category: 'Dining',
    price: 157000,
    available: true,
    tag: 'Solid wood',
    lead: 'One slab, eased edges, seats eight with ease.',
    story:
      'Milled from a single white-oak board and finished in a hand-rubbed oil that deepens with use. No veneer, no shortcuts.',
    image:
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
    ],
    specs: ['Solid white oak', '240 × 100 cm', 'Natural oil finish'],
  },
  {
    id: 'arc-lamp',
    name: 'Arc Floor Lamp',
    category: 'Lighting',
    price: 34900,
    available: true,
    tag: 'New',
    lead: 'A brass arc that pools light over a reading chair.',
    story:
      'Weighted marble base, dimmable LED, and a linen shade. Designed to float above a sofa without a ceiling rose.',
    image:
      'https://images.unsplash.com/photo-1675767528117-963ce219b52a?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1675767528117-963ce219b52a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=1400&q=80',
    ],
    specs: ['Brass + marble', 'Dimmable LED', 'Height 210 cm'],
  },
  {
    id: 'wool-rug',
    name: 'Hand-Knotted Wool Rug',
    category: 'Living',
    price: 56500,
    available: true,
    tag: 'Limited',
    lead: 'A low pile in oat and clay, knotted in Rajasthan.',
    story:
      'Each rug takes three weeks on the loom. The pattern is intentionally quiet so furniture, not the floor, leads the room.',
    image:
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1400&q=80',
    ],
    specs: ['New Zealand wool', '240 × 170 cm', 'Hand-knotted in Rajasthan'],
  },
  {
    id: 'lounge-chair',
    name: 'Leather Lounge Chair',
    category: 'Living',
    price: 103000,
    available: true,
    tag: 'Editor’s pick',
    lead: 'A deep sit in vegetable-tanned hide.',
    story:
      'The hide will mark and darken — that is the point. A single chair that earns its place beside a window.',
    image:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=80',
    ],
    specs: ['Vegetable-tanned leather', 'Walnut frame', 'Down-blend cushion'],
  },
  {
    id: 'side-table',
    name: 'Travertine Side Table',
    category: 'Living',
    price: 32400,
    available: true,
    tag: 'Stone',
    lead: 'A compact plinth in honed travertine.',
    story:
      'Cut from a single block. The voids in the stone are left open, then sealed — no filler, no fake marble.',
    image:
      'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80',
    ],
    specs: ['Honed travertine', '45 × 45 × 42 cm', 'Sealed stone'],
  },
  {
    id: 'lantern',
    name: 'Paper Lantern Pendant',
    category: 'Lighting',
    price: 14900,
    available: true,
    tag: 'Quiet light',
    lead: 'Washi paper, a warm 2700K glow.',
    story:
      'Hung in a cluster over a dining table or alone in a hallway. Ships flat, unfolds in minutes.',
    image:
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1400&q=80',
    ],
    specs: ['Washi paper', 'E27 fitting', 'Diameter 55 cm'],
  },
  {
    id: 'credenza',
    name: 'Walnut Credenza',
    category: 'Dining',
    price: 174000,
    available: true,
    tag: 'Studio piece',
    lead: 'Low storage with a continuous grain wrap.',
    story:
      'Soft-close drawers, cable pass-throughs, and a finish that likes fingerprints less than you would expect.',
    image:
      'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&w=1400&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=80',
    ],
    specs: ['American walnut', 'Soft-close hardware', '180 × 45 × 72 cm'],
  },
];

export const getProductById = (id) => PRODUCTS.find((item) => item.id === id);
