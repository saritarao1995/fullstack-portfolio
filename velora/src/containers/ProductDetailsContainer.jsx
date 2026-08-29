import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import ProductGallery from '../components/product/ProductGallery';
import ProductInfo from '../components/product/ProductInfo';
import RelatedRail from '../components/product/RelatedRail';
import { selectProductById, selectRelatedProducts } from '../store/selectors/catalogSelectors';
import { itemAdded } from '../store/slices/cartSlice';
import { toastPushed } from '../store/slices/toastSlice';

const ProductDetailsContainer = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectProductById(productId));
  const related = useSelector((state) => selectRelatedProducts(state, productId));
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setQty(1);
  }, [productId]);

  const handleIncrease = useCallback(() => {
    setQty((value) => value + 1);
  }, []);

  const handleDecrease = useCallback(() => {
    setQty((value) => Math.max(1, value - 1));
  }, []);

  const handleAdd = useCallback(() => {
    if (!product) return;
    dispatch(
      itemAdded({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        qty,
      }),
    );
    dispatch(toastPushed({ message: `${product.name} added to bag.` }));
  }, [dispatch, product, qty]);

  if (!product || product.available === false) {
    return (
      <p className="px-6 py-24 text-center">
        That piece has left the floor.{' '}
        <Link to="/shop" className="text-clay">
          Back to collection
        </Link>
      </p>
    );
  }

  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2">
        <ProductGallery product={product} />
        <ProductInfo
          product={product}
          qty={qty}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onAdd={handleAdd}
        />
      </section>
      <RelatedRail products={related} />
    </>
  );
};

export default ProductDetailsContainer;
