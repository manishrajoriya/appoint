import {PayData} from "../../../../../payu.config";

export default async function handler(req, res) {
  const { txnid } = req.query;

  if (req.method === "POST") {
    try {
      const verified_Data = await PayData.payuClient.verifyPayment(txnid);
      const data = verified_Data.transaction_details[txnid];

      res.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/${data.status}/${data.txnid}`
      );
    } catch (error: any) {
      res.status(400).json({ msg: error.message, stack: error.stack });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
