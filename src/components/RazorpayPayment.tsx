"use client";
import { useState } from "react";
import axios from "axios";

export default function PaymentForm() {
  const [amount, setAmount] = useState("");

  const handlePayment = async () => {
    try {
      // Step 1: Create an order on the server
      const { data } = await axios.post("/api/create-order", {
        amount, // Amount in INR
        currency: "INR",
        
        
      });

      const { id: order_id, amount: order_amount, currency } = data;

      // Step 2: Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Razorpay key ID (use .env.local for storing this)
        amount: order_amount,
        currency,
        name: "Your Website Name",
        description: "Test Transaction",
        order_id, // Order ID from the backend
        handler: async function (response: any) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response; 

          //// Step 3: Verify payment on the server (optional but recommended)
          const verification = await axios.post("/api/verify-payment", {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
          });

          if (verification.data.success) {
            alert("Payment Successful!");
          } else {
            alert("Payment Verification Failed");
          }
        },
        prefill: {
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9876543210",
        },
        notes: {
          address: "Some Address here",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay =  new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment failed: ", error);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter Amount in INR (Rs.) to be paid to Razorpay API server to create an order and open Razorpay Checkout"
      />
      <button onClick={handlePayment}>Pay Now - with Razorpay Checkout</button>
    </div>
  );
}
