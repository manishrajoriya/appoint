import { NextResponse } from "next/server";
import { PayData } from "../../../../payu.config";
import crypto from "crypto";
import { log } from "console";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body
    const txn_id = "PAYU_MONEY_" + Math.floor(Math.random() * 8888888);
    const { amount, product, firstname, email, mobile } = body;
console.log(amount, product, firstname, email, mobile);
 

    let udf1 = "";
    let udf2 = "";
    let udf3 = "";
    let udf4 = "";
    let udf5 = "";

    const hashString = `${PayData.payu_key}|${txn_id}|${amount}|${JSON.stringify(
      product
    )}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${PayData.payu_salt}`;

    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const data = await PayData.payuClient.paymentInitiate({
      isAmountFilledByCustomer: false,
      txnid: txn_id,
      amount: amount.tonumber(),
      currency: "INR",
      productinfo: JSON.stringify(product),
      firstname: firstname,
      email: email,
      phone: mobile,
      surl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${txn_id}`,
      furl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${txn_id}`,
      hash,
    });
     console.log(data)
    
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { msg: error.message, stack: error.stack },
      { status: 400 }
    );
  }
}
