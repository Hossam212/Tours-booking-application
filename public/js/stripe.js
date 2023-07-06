import axios from 'axios';
import { showAlert } from './alert';
import { loadStripe } from '@stripe/stripe-js';
export const bookTour = async (tourId) => {
  const stripe = await loadStripe(
    'pk_test_51NQgLnAMjq2DeMy9mzc7CJhqEvRPVucYCwtXVhUoBkS6J7ppwY5jtObApiWNFB2NJ5zJmoIWBk07W7jX7MihGgR600mSRIrubK'
  );
  try {
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
