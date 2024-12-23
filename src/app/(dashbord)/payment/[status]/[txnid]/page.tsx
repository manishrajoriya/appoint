import { useRouter } from "next/router";

export default function PaymentStatusPage() {
  const router = useRouter();
  const { status, txnid } = router.query;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">
        Payment {status === "success" ? "Successful" : "Failed"}
      </h1>
      <p className="text-lg">
        Transaction ID: <span className="font-mono">{txnid}</span>
      </p>
      <p className="mt-4">
        {status === "success"
          ? "Thank you for your payment!"
          : "Unfortunately, your payment could not be processed. Please try again."}
      </p>
      <button
        onClick={() => router.push("/payment")}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Make Another Payment
      </button>
    </div>
  );
}
