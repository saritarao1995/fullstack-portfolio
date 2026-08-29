import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toast from '../components/ui/Toast';
import { toastDismissed } from '../store/slices/toastSlice';
import { selectToasts } from '../store/selectors/toastSelectors';

const AUTO_DISMISS_MS = 6000;

const ToastContainer = () => {
  const dispatch = useDispatch();
  const toasts = useSelector(selectToasts);

  const handleDismiss = useCallback((id) => dispatch(toastDismissed(id)), [dispatch]);

  useEffect(() => {
    if (toasts.length === 0) return undefined;

    const timers = toasts.map((toast) =>
      setTimeout(() => dispatch(toastDismissed(toast.id)), AUTO_DISMISS_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={handleDismiss} />
      ))}
    </div>
  );
};

export default ToastContainer;
