import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils/format';

const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} className="group">
    <div className="overflow-hidden rounded-[1.6rem] bg-sand">
      <img
        src={product.image}
        alt={product.name}
        className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
    </div>
    <div className="mt-3 flex items-baseline justify-between gap-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-ink-soft">{product.tag}</p>
        <h3 className="mt-1 font-display text-xl">{product.name}</h3>
      </div>
      <span className="text-sm">{formatMoney(product.price)}</span>
    </div>
  </Link>
);

export default ProductCard;
