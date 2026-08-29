import { Link } from 'react-router-dom';
import { formatMoney } from '../../utils/format';

const ProductRow = ({ product, onDelete }) => {
  const handleDelete = () => onDelete(product.id);

  return (
    <tr className="border-b border-ink/8 text-sm">
      <td className="px-4 py-4">
        <p className="font-medium">{product.name}</p>
        <p className="text-xs text-ink-soft">{product.id}</p>
      </td>
      <td className="px-4 py-4">{product.category}</td>
      <td className="px-4 py-4">{formatMoney(product.price)}</td>
      <td className="px-4 py-4">{product.available === false ? 'Hidden' : 'On floor'}</td>
      <td className="px-4 py-4 text-right">
        <Link to={`/studio/products/${product.id}`} className="text-clay underline">
          Edit
        </Link>
        <button type="button" onClick={handleDelete} className="ml-4 text-ink-soft underline">
          Remove
        </button>
      </td>
    </tr>
  );
};

const ProductsTable = ({ products, onDelete }) => (
  <div className="overflow-x-auto rounded-3xl bg-white/70 p-2 shadow-sm">
    <table className="w-full min-w-[640px] text-left">
      <thead className="text-xs uppercase tracking-[0.14em] text-ink-soft">
        <tr>
          <th className="px-4 py-3 font-medium">Piece</th>
          <th className="px-4 py-3 font-medium">Room</th>
          <th className="px-4 py-3 font-medium">Price</th>
          <th className="px-4 py-3 font-medium">Floor</th>
          <th className="px-4 py-3 font-medium" />
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  </div>
);

export default ProductsTable;
