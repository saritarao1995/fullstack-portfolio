import { Link } from 'react-router-dom';

const StoreFooter = ({ name, description, address, phone, email, hours }) => (
  <footer className="mt-24 border-t border-ink/10">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-display text-3xl text-ink">{name}</p>
        <p className="mt-2 max-w-sm text-sm text-ink-soft">{description}</p>
        <p className="mt-3 text-sm text-ink-soft">{address}</p>
        <p className="text-sm text-ink-soft">
          {phone} · {email}
        </p>
        <p className="text-xs text-ink-soft">{hours}</p>
      </div>
      <div className="flex flex-wrap gap-6 text-sm text-ink-soft">
        <Link to="/shop">Collection</Link>
        <Link to="/story">Atelier</Link>
        <Link to="/contact">Visit</Link>
        <Link to="/returns">Returns</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/studio">Studio login</Link>
      </div>
    </div>
  </footer>
);

export default StoreFooter;
