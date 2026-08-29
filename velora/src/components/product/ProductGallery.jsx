const photosOf = (product) => {
  const gallery = Array.isArray(product.gallery) ? product.gallery.filter(Boolean) : [];
  if (gallery.length) return gallery;
  return product.image ? [product.image] : [];
};

const ProductGallery = ({ product }) => (
  <div className="grid gap-3">
    {photosOf(product).map((src) => (
      <img
        key={src}
        src={src}
        alt={product.name}
        className="h-80 w-full rounded-3xl object-cover md:h-[420px]"
      />
    ))}
  </div>
);

export default ProductGallery;
