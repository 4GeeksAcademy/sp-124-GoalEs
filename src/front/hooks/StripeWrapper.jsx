import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./../StripeCheckout";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const StripeWrapper = ({ course }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm course={course} />
        </Elements>
    );
};