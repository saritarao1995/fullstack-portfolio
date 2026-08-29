import { Link } from 'react-router-dom';
import FeaturedCard from './FeaturedCard';

const FeaturedGrid = ({ products }) => (
  <section className="mx-auto max-w-6xl px-6 py-20">
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-clay">This season</p>
        <h2 className="mt-2 font-display text-4xl">Pieces we keep in the studio</h2>
      </div>
      <Link to="/shop" className="hidden text-sm uppercase tracking-[0.16em] text-clay sm:block">
        Full collection →
      </Link>
    </div>
    <div className="mt-10 grid gap-10 md:grid-cols-3">
      {products.map((product) => (
        <FeaturedCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);

export default FeaturedGrid;
