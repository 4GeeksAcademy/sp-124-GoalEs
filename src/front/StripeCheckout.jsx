import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import useGlobalReducer from "./hooks/useGlobalReducer";
import "./pages/styles/privatePageUser.css";
import { useNavigate } from "react-router-dom";

export const CheckoutForm = ({ course }) => {

    const stripe = useStripe();
    const elements = useElements();
    const { store } = useGlobalReducer();
    const backendURL = import.meta.env.VITE_BACKEND_URL;

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;
        setLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/success`,
            },
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
        } else if (paymentIntent?.status === "succeeded") {
            await fetch(backendURL + "/user_course", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    active: true,
                    user_id: store.user.id,
                    course_id: course.id,
                }),
            });
            setSuccess(true);
            setTimeout(() => navigate("/users/home"), 2000);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="payment-success">
                <p>Payment successful! Course unlocked!</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button
                className="pay-button"
                disabled={!stripe || loading}
            >
                {loading ? "Processing..." : "Pay"}
            </button>
            {message && <p>{message}</p>}
        </form>
    );
};