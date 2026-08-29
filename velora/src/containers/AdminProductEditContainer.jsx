import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from '../components/admin/ProductForm';
import { selectProductById } from '../store/selectors/catalogSelectors';
import { upsertProduct } from '../store/thunks/catalogThunks';
import { uploadImage } from '../services/uploadService';

const blankForm = {
  name: '',
  category: 'Living',
  price: '',
  available: true,
  tag: 'Showroom',
  lead: '',
  story: '',
  image: '',
  gallery: '',
  specs: '',
};

const toForm = (product) => ({
  name: product.name ?? '',
  category: product.category ?? 'Living',
  price: String(product.price ?? ''),
  available: product.available !== false,
  tag: product.tag ?? '',
  lead: product.lead ?? '',
  story: product.story ?? '',
  image: product.image ?? '',
  gallery: (product.gallery ?? []).join('\n'),
  specs: (product.specs ?? []).join('\n'),
});

const lines = (text) =>
  String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const AdminProductEditContainer = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNew = !productId;
  const existing = useSelector(selectProductById(productId));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [pickBusy, setPickBusy] = useState('');
  const [form, setForm] = useState(() => (existing ? toForm(existing) : blankForm));

  useEffect(() => {
    if (existing) setForm(toForm(existing));
  }, [existing]);

  const title = useMemo(() => (isNew ? 'New piece' : existing?.name || 'Edit piece'), [isNew, existing]);

  const handleChange = (field, value) => {
    setError('');
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleAvailable = (available) => {
    setForm((current) => ({ ...current, available }));
  };

  const handlePickImage = async (file) => {
    setError('');
    setPickBusy('image');
    try {
      const url = await uploadImage(file);
      setForm((current) => ({ ...current, image: url }));
    } catch (err) {
      setError(err.message || 'Could not upload that photo.');
    } finally {
      setPickBusy('');
    }
  };

  const handlePickGallery = async (file) => {
    setError('');
    setPickBusy('gallery');
    try {
      const url = await uploadImage(file);
      setForm((current) => ({
        ...current,
        gallery: [current.gallery, url].filter(Boolean).join('\n'),
        image: current.image || url,
      }));
    } catch (err) {
      setError(err.message || 'Could not upload that photo.');
    } finally {
      setPickBusy('');
    }
  };

  const handleCancel = () => {
    navigate('/studio/products');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim() || price < 1) {
      setError('Name and a price in INR are required.');
      return;
    }

    const gallery = lines(form.gallery);
    const image = form.image.trim() || gallery[0] || '';
    const payload = {
      id: existing?.id,
      _existing: Boolean(existing),
      name: form.name.trim(),
      category: form.category,
      price,
      available: form.available,
      tag: form.tag.trim() || 'Showroom',
      lead: form.lead.trim(),
      story: form.story.trim(),
      image,
      gallery: gallery.length ? gallery : image ? [image] : [],
      specs: lines(form.specs),
    };

    setBusy(true);
    const result = await dispatch(upsertProduct(payload));
    setBusy(false);

    if (upsertProduct.fulfilled.match(result)) {
      navigate('/studio/products');
      return;
    }

    setError(result.payload || 'Could not save the piece.');
  };

  if (!isNew && !existing) {
    return (
      <section className="px-6 py-10 sm:px-8">
        <p className="text-sm text-ink-soft">That piece is not on the floor.</p>
      </section>
    );
  }

  return (
    <section className="px-6 py-10 sm:px-8">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">Floor</p>
      <h1 className="mt-2 font-display text-4xl">{title}</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-soft">
        Prices are in Indian rupees. Photos come from your computer (Choose from computer) or a
        link. Uncheck “on the floor” to hide a piece from the shop without deleting it.
      </p>
      <ProductForm
        form={form}
        error={error}
        busy={busy}
        isNew={isNew}
        onChange={handleChange}
        onAvailable={handleAvailable}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onPickImage={handlePickImage}
        onPickGallery={handlePickGallery}
        pickBusy={pickBusy}
      />
    </section>
  );
};

export default AdminProductEditContainer;
