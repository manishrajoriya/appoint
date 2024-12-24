"use client";
import { useState } from "react";

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    amount: "",
    product: "",
    firstname: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/get-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Payment initiation failed.");

      const data = await response.json();
      setMessage("Payment initiated successfully! Proceed to PayU.");
      // window.location.href = data;
      
      // window.location.href ="https://test.payu.in/_payment";
      console.log(data); // Debugging
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Make a Payment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Amount</label>
          <input
           title="Amount should be in INR"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Product Info</label>
          <input
          title="Product Info"
            type="text"
            name="product"
            value={formData.product}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">First Name</label>
          <input
          title="First Name"
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input
          title="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Mobile</label>
          <input
          title="Mobile"
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit Payment"}
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  );
}
