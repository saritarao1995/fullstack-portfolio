import { useDispatch, useSelector } from 'react-redux';
import FilterBar from '../components/shop/FilterBar';
import ProductCard from '../components/shop/ProductCard';
import { categoryChanged, queryChanged } from '../store/slices/catalogSlice';
import {
  selectCatalogCategory,
  selectCatalogError,
  selectCatalogQuery,
  selectCatalogStatus,
  selectFilteredProducts,
} from '../store/selectors/catalogSelectors';

const ShopContainer = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectFilteredProducts);
  const category = useSelector(selectCatalogCategory);
  const query = useSelector(selectCatalogQuery);
  const catalogStatus = useSelector(selectCatalogStatus);
  const catalogError = useSelector(selectCatalogError);

  const handleCategory = (next) => {
    dispatch(categoryChanged(next));
  };

  const handleQuery = (next) => {
    dispatch(queryChanged(next));
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">Collection</p>
      <h1 className="mt-2 font-display text-5xl">The floor, the table, the light.</h1>
      <div className="mt-10">
        <FilterBar
          category={category}
          query={query}
          onCategory={handleCategory}
          onQuery={handleQuery}
        />
      </div>
      {catalogStatus === 'loading' ? (
        <p className="mt-16 text-center text-ink-soft">Loading the floor…</p>
      ) : null}
      {catalogStatus === 'error' ? (
        <p className="mt-16 text-center text-clay-deep">{catalogError}</p>
      ) : null}
      {catalogStatus === 'ready' ? (
        <>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 ? (
            <p className="mt-16 text-center text-ink-soft">Nothing in this room yet. Try another filter.</p>
          ) : null}
        </>
      ) : null}
    </section>
  );
};

export default ShopContainer;
