import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectToastMessage } from '../store/selectors/toastSelectors';
import { toastCleared } from '../store/slices/toastSlice';

const ToastContainer = () => {
  const dispatch = useDispatch();
  const message = useSelector(selectToastMessage);

  useEffect(() => {
    if (!message) return undefined;

    const timer = setTimeout(() => {
      dispatch(toastCleared());
    }, 2400);

    return () => clearTimeout(timer);
  }, [dispatch, message]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-parchment shadow-lg">
      {message}
    </div>
  );
};

export default ToastContainer;
