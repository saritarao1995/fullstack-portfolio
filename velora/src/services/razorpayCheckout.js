import { createPaymentOrder, loadRazorpayScript, verifyPayment } from './paymentService';
import { inrToPaise } from '../utils/payment';

export const confirmPayment = async ({
  orderId,
  amountInr,
  customer,
  email,
  phone,
  companyName = 'Velora Atelier',
}) => {
  const amount = inrToPaise(amountInr);
  const session = await createPaymentOrder(amount, orderId);

  await loadRazorpayScript();

  const response = await new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: session.keyId,
      amount: session.amount,
      currency: session.currency,
      name: companyName,
      description: `Order ${orderId}`,
      order_id: session.orderId,
      prefill: { name: customer, email, contact: phone },
      handler: (result) => resolve(result),
      modal: { ondismiss: () => reject(new Error('Payment cancelled.')) },
    });
    checkout.on('payment.failed', () => reject(new Error('Payment failed.')));
    checkout.open();
  });

  const verified = await verifyPayment(response);
  return {
    orderId,
    paymentId: verified.paymentId,
    provider: 'razorpay',
  };
};
