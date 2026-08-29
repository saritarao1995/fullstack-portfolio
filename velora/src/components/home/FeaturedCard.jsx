import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils/format';

const FeaturedCard = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group block">
    <div className="overflow-hidden rounded-3xl bg-sand">
      <img
        src={product.image}
        alt={product.name}
        className="h-80 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
    </div>
    <div className="mt-4 flex items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">{product.category}</p>
        <h3 className="mt-1 font-display text-2xl">{product.name}</h3>
      </div>
      <p className="text-sm">{formatMoney(product.price)}</p>
    </div>
  </Link>
);

export default FeaturedCard;
