export const SHOWROOM_ADDRESS = 'Velora Atelier, Civil Lines, Kota 324001';

export const DELIVERY_OPTIONS = [
  {
    id: 'home',
    title: 'Online home delivery',
    body: 'White-glove: we place the piece in the room and take the packing away. Workshop pieces ship in 4–6 weeks.',
    fee: 7500,
    eta: '4–6 weeks',
  },
  {
    id: 'pickup',
    title: 'Collect from the Kota showroom',
    body: 'We call when it is ready. Bring photo ID. No delivery fee.',
    fee: 0,
    eta: 'Ready in 4–6 weeks, then collect',
  },
];

export const getDeliveryOption = (id) =>
  DELIVERY_OPTIONS.find((option) => option.id === id) ?? DELIVERY_OPTIONS[0];
