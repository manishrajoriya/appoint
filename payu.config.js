const PayU = require("payu-websdk");

const payu_key = process.env.MERCHANT_KEY;
const payu_salt = process.env.MERCHANT_SALT;

// Create a PayU client instance
const payuClient = new PayU(
  {
    key: payu_key,
    salt: payu_salt,
  },
  process.env.PAYU_ENVIRONMENT // Example: "sandbox" or "production"
);

exports.PayData = {
  payuClient,
  payu_key,
  payu_salt,
};
