import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductsTable from '../components/admin/ProductsTable';
import { selectCatalogItems } from '../store/selectors/catalogSelectors';
import { deleteProduct } from '../store/thunks/catalogThunks';

const AdminProductsContainer = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectCatalogItems);

  const handleDelete = (productId) => {
    const ok = window.confirm('Remove this piece from the floor? Existing orders keep their lines.');
    if (!ok) return;
    dispatch(deleteProduct(productId));
  };

  return (
    <section className="px-6 py-10 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-clay">Floor</p>
          <h1 className="mt-2 font-display text-4xl">Pieces</h1>
          <p className="mt-2 max-w-xl text-sm text-ink-soft">
            Add, edit, or hide pieces. Hidden items leave the shop until you put them back on the
            floor.
          </p>
        </div>
        <Link
          to="/studio/products/new"
          className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-3 text-sm font-medium text-parchment hover:bg-clay-deep"
        >
          Add a piece
        </Link>
      </div>
      <div className="mt-8">
        {products.length ? (
          <ProductsTable products={products} onDelete={handleDelete} />
        ) : (
          <p className="rounded-3xl bg-white/70 p-8 text-sm text-ink-soft">No pieces yet.</p>
        )}
      </div>
    </section>
  );
};

export default AdminProductsContainer;
