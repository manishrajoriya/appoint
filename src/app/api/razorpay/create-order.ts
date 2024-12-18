import Razorpay from "razorpay";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { amount, currency } = req.body;

    try {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("Razorpay keys not found in .env.local");
        res.status(500).json({ message: "Razorpay keys not found in .env.local" });
        return;
      }

      // Initialize Razorpay instance with your API Key and Secret
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID, // Store in .env.local
        key_secret: process.env.RAZORPAY_KEY_SECRET, // Store in .env.local
      });

      // Create an order
      const options = {
        amount: amount * 100, // Amount in paise (multiply by 100 for INR)
        currency,
        receipt: `receipt_${Date.now()}`,
      };

      const order = await razorpay.orders.create(options);

      res.status(200).json(order); // Send order details to the frontend
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
