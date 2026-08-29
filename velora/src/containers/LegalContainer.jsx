import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LEGAL_PAGES } from '../data/legal';
import { selectCompany } from '../store/selectors/settingsSelectors';

const LegalContainer = () => {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const page = LEGAL_PAGES[slug];
  const company = useSelector(selectCompany);

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="text-xs uppercase tracking-[0.22em] text-clay">{page.kicker}</p>
      <h1 className="mt-3 font-display text-5xl leading-tight">{page.title}</h1>
      {page.body.map((paragraph) => (
        <p key={paragraph} className="mt-5 text-lg text-ink-soft">
          {paragraph}
        </p>
      ))}
      {slug === 'contact' ? (
        <div className="mt-10 rounded-3xl bg-sand p-6 text-sm">
          <p className="font-medium">{company.name}</p>
          <p className="mt-2 text-ink-soft">{company.address}</p>
          <p className="text-ink-soft">
            {company.phone} · {company.email}
          </p>
          <p className="mt-2 text-ink-soft">{company.hours}</p>
        </div>
      ) : null}
    </article>
  );
};

export default LegalContainer;
