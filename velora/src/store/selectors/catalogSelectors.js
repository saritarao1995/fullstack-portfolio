import { createSelector } from '@reduxjs/toolkit';

export const selectCatalogItems = (state) => state.catalog.items;
export const selectCatalogCategory = (state) => state.catalog.category;
export const selectCatalogQuery = (state) => state.catalog.query;
export const selectCatalogStatus = (state) => state.catalog.status;
export const selectCatalogError = (state) => state.catalog.error;

export const selectFilteredProducts = createSelector(
  [selectCatalogItems, selectCatalogCategory, selectCatalogQuery],
  (items, category, query) => {
    const needle = query.trim().toLowerCase();

    return items.filter((item) => {
      if (item.available === false) return false;

      const categoryOk = category === 'All' || item.category === category;
      const queryOk =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        (item.lead || '').toLowerCase().includes(needle);

      return categoryOk && queryOk;
    });
  },
);

export const selectFeaturedProducts = createSelector([selectCatalogItems], (items) =>
  items.filter((item) => item.available !== false).slice(0, 3),
);

export const selectProductById = (id) => (state) =>
  state.catalog.items.find((item) => item.id === id);

export const selectRelatedProducts = createSelector(
  [selectCatalogItems, (_state, productId) => productId],
  (items, productId) => {
    const current = items.find((item) => item.id === productId);
    if (!current) return [];

    const floor = items.filter((item) => item.available !== false);
    const sameRoom = floor.filter(
      (item) => item.id !== productId && item.category === current.category,
    );

    return (sameRoom.length ? sameRoom : floor.filter((item) => item.id !== productId)).slice(
      0,
      3,
    );
  },
);
