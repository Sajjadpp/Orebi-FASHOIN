import axios from "axios";
import { userAxiosInstance } from "../../redux/constants/AxiosInstance";

const handlePayment = async (Razorpay, onSuccess, onFailure, amount) => {
    try {
        // Fetch order ID and key from backend
        const { data } = await userAxiosInstance.post("/create-order", { amount: amount });

        const options = {
            key: data.key,               // Fetched securely
            amount: amount,               // Amount in paise
            currency: "INR",
            name: "OREBI",
            description: "Subscription Payment",
            order_id: data.orderId,      // Dynamic order ID
            handler: (response) => {
                onSuccess(response)
                // Call backend to verify payment
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "7034384914",
            },
            theme: {
                color: "#F37254",
            },
        };

        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();

    } catch (error) {
        console.error("Payment error:", error);
        alert("Payment initialization failed.");
    }
};

export default handlePayment