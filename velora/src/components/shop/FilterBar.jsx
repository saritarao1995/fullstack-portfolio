const CATEGORIES = ['All', 'Living', 'Dining', 'Lighting'];

const CategoryButton = ({ label, active, onSelect }) => {
  const handleClick = () => onSelect(label);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-full px-4 py-2 text-sm ${
        active ? 'bg-ink text-parchment' : 'bg-sand text-ink-soft hover:text-ink'
      }`}
    >
      {label}
    </button>
  );
};

const FilterBar = ({ category, query, onCategory, onQuery }) => {
  const handleQuery = (event) => onQuery(event.target.value);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((label) => (
          <CategoryButton
            key={label}
            label={label}
            active={category === label}
            onSelect={onCategory}
          />
        ))}
      </div>
      <input
        value={query}
        onChange={handleQuery}
        placeholder="Search linen, oak, lamp…"
        className="w-full rounded-full border border-ink/10 bg-white/60 px-5 py-3 text-sm outline-none focus:border-clay sm:max-w-xs"
      />
    </div>
  );
};

export default FilterBar;
