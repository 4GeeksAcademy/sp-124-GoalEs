import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "../StripeCheckout";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
    const { state } = useLocation();
    const course = state?.course;
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const { store } = useGlobalReducer();
    const user = store.user;
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        if (!user) return;

        const token = localStorage.getItem("token-user");
        const amount = Number(course.cost) * 100;

        console.log("user:", user);

        fetch(backendURL + "/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                amount,
                course_id: course.id,
                user_id: user.id,
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log("respuesta backend:", data);
                setClientSecret(data.clientSecret);
            });
    }, [course, backendURL, user]);

    if (!clientSecret) {
        return <p>Loading payment form...</p>;
    }

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm course={course} />
        </Elements>
    );
}