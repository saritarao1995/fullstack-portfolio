export const selectOrders = (state) => state.orders.list;
export const selectOrderStatus = (state) => state.orders.status;
export const selectOrdersHydrated = (state) => state.orders.hydrated;
export const selectOrderError = (state) => state.orders.error;

export const selectOrderById = (state, orderId) =>
  state.orders.list.find((order) => order.id === orderId);

const COUNTS_AS_REVENUE = (status) => status !== 'Awaiting payment';

export const selectOrderStats = (state) => {
  const list = state.orders.list;
  const paid = list.filter((order) => COUNTS_AS_REVENUE(order.status));
  const revenue = paid.reduce((sum, order) => sum + order.total, 0);
  const open = list.filter((order) => order.status !== 'Delivered').length;

  return {
    orders: list.length,
    revenue,
    open,
    aov: paid.length ? Math.round(revenue / paid.length) : 0,
  };
};
