const PROMISES = [
  { title: 'Order online', body: 'Home delivery with white-glove placement, or collect in Kota.' },
  { title: 'Made to order', body: 'Most pieces leave the workshop in four to six weeks.' },
  { title: 'Quiet finishes', body: 'Oil, stone seal, and hide that marks honestly.' },
];

const PromiseStrip = () => (
  <section className="mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:grid-cols-3">
    {PROMISES.map((item) => (
      <article key={item.title}>
        <h3 className="font-display text-2xl">{item.title}</h3>
        <p className="mt-2 text-sm text-ink-soft">{item.body}</p>
      </article>
    ))}
  </section>
);

export default PromiseStrip;
