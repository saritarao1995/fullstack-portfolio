import ProductCard from '../shop/ProductCard';

const RelatedRail = ({ products }) => {
  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">In the same room</p>
      <h2 className="mt-2 font-display text-3xl">You might place nearby</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedRail;
