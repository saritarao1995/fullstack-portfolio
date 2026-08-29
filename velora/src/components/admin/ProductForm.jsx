import { CATEGORIES } from '../../data/products';
import ImageField from './ImageField';

const FIELD =
  'mt-2 w-full rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm outline-none focus:border-clay';

const ProductForm = ({
  form,
  error,
  busy,
  isNew,
  onChange,
  onAvailable,
  onSubmit,
  onCancel,
  onPickImage,
  onPickGallery,
  pickBusy,
}) => {
  const handleField = (field) => (event) => onChange(field, event.target.value);
  const handleAvailable = (event) => onAvailable(event.target.checked);
  const handleImageUrl = (value) => onChange('image', value);
  const handleGalleryFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onPickGallery(file);
  };

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-2xl space-y-5">
      <label className="block text-sm">
        Name
        <input required value={form.name} onChange={handleField('name')} className={FIELD} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Room
          <select value={form.category} onChange={handleField('category')} className={FIELD}>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          Price (INR)
          <input
            required
            type="number"
            min="1"
            step="1"
            value={form.price}
            onChange={handleField('price')}
            className={FIELD}
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Tag
          <input value={form.tag} onChange={handleField('tag')} className={FIELD} />
        </label>
        <label className="flex items-center gap-3 pt-8 text-sm">
          <input type="checkbox" checked={form.available} onChange={handleAvailable} />
          On the floor (customers can buy)
        </label>
      </div>
      <label className="block text-sm">
        Short line
        <input value={form.lead} onChange={handleField('lead')} className={FIELD} />
      </label>
      <label className="block text-sm">
        Story
        <textarea rows={4} value={form.story} onChange={handleField('story')} className={FIELD} />
      </label>
      <ImageField
        label="Main photo"
        hint="From your phone or computer. Any size fills this same photo box."
        value={form.image}
        busy={pickBusy === 'image'}
        onFile={onPickImage}
        onUrl={handleImageUrl}
      />
      <label className="block text-sm">
        Extra gallery photos (one link per line)
        <textarea rows={3} value={form.gallery} onChange={handleField('gallery')} className={FIELD} />
      </label>
      <label className="inline-flex cursor-pointer items-center justify-center rounded-full border border-ink/15 px-5 py-2 text-sm">
        {pickBusy === 'gallery' ? 'Uploading…' : 'Add gallery photo from computer'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleGalleryFile}
          disabled={Boolean(pickBusy)}
        />
      </label>
      <label className="block text-sm">
        Specs (one per line)
        <textarea rows={3} value={form.specs} onChange={handleField('specs')} className={FIELD} />
      </label>
      {error ? <p className="text-sm text-clay-deep">{error}</p> : null}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-3 text-sm font-medium text-parchment hover:bg-clay-deep disabled:opacity-60"
        >
          {busy ? 'Saving…' : isNew ? 'Add piece' : 'Save piece'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-full border border-ink/15 px-6 py-3 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
