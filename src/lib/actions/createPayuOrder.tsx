'use server';

import crypto from 'crypto';

const PAYU_MERCHANT_KEY = process.env.MERCHANT_KEY || 'your_merchant_key';
const PAYU_SALT = process.env.MERCHANT_SALT || 'your_salt';
const PAYU_BASE_URL = 'https://test.payu.in';

interface PayuOrderParams {
  productInfo: string;
  amount: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export async function createPayuOrder(params: PayuOrderParams) {
  if (!PAYU_MERCHANT_KEY || !PAYU_SALT) {
    throw new Error('Merchant key or salt is missing. Please set it in the environment variables.');
  }

  const txnId = `TXN_${Date.now()}`;
  const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payu-callback`;

  const payload = {
    key: PAYU_MERCHANT_KEY,
    txnid: txnId,
    amount: params.amount.toFixed(2),
    currency: 'INR',
    productinfo: params.productInfo,
    firstname: params.firstName,
    lastname: params.lastName,
    email: params.email,
    phone: params.phone,
    surl: callbackUrl,
    furl: callbackUrl,
    udf1: '',
    udf2: '',
    udf3: '',
    udf4: '',
  };

  const payuHash = generatePayuHash(payload);
  const formData = new URLSearchParams({
    ...payload,
    hash: payuHash,
  });

  try {
    const response = await fetch(`${PAYU_BASE_URL}/_payment`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.ok) {
      return { success: true, paymentUrl: `${PAYU_BASE_URL}/_payment` };
    } else {
      return { success: false, error: 'Failed to create PayU order' };
    }
  } catch (error) {
    console.error('Error creating PayU order:', error);
    return { success: false, error: 'An error occurred while creating the order' };
  }
}

function generatePayuHash(payload: Record<string, string>) {
  const udfFields = `${payload.udf1 || ''}|${payload.udf2 || ''}|${payload.udf3 || ''}|${payload.udf4 || ''}`;
  const hashString = `${PAYU_MERCHANT_KEY}|${payload.txnid}|${payload.amount}|${payload.productinfo}|${payload.firstname}|${payload.email}|${udfFields}|||||||||||${PAYU_SALT}`;
  return crypto.createHash('sha512').update(hashString).digest('hex');
}
