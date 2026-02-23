import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import useGlobalReducer from "./hooks/useGlobalReducer";

export const CheckoutForm = ({ course }) => {

    const backendURL = import.meta.env.VITE_BACKEND_URL

    const stripe = useStripe();
    const elements = useElements();
    const { store } = useGlobalReducer();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch(backendURL + "/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${store.token}`
            },
            body: JSON.stringify({
                amount: Number(course.cost) * 100,
                user_id: store.user.id,
                course_id: course.id
            })
        });

        const data = await res.json();
        console.log("PaymentIntent response:", data);

        if (!res.ok) {
            setMessage(data.error || "Payment failed");
            setLoading(false);
            return;
        }

        const clientSecret = data.clientSecret;

        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });

        if (result.error) {
            setMessage(result.error.message);
            setLoading(false);
            return;
        }

        if (result.paymentIntent.status === "succeeded") {

            await fetch(backendURL + "/user_course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    active: true,
                    user_id: store.user.id,
                    course_id: course.id
                })
            });

            setMessage("Payment successful! Course unlocked!");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button disabled={!stripe || loading}>
                {loading ? "Processing..." : "Pay"}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
}