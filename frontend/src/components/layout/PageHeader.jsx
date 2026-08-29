const PageHeader = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
    {description && <p className="mt-3 max-w-2xl text-slate-400">{description}</p>}
  </div>
);

export default PageHeader;
