// FILE: src/utils/upi.ts
interface UpiPaymentParams {
  upiId: string;
  payeeName: string;
  amount?: string | number | undefined;
  transactionNote?: string;
}

export const buildUpiUri = ({
  upiId,
  payeeName,
  amount,
  transactionNote = 'Payment via ChowkSpot',
}: UpiPaymentParams): string => {
  // If worker entered a raw 10-digit mobile number, default it to a standard mobile UPI handle format or keep as is
  let cleanUpi = upiId.trim();
  if (/^\d{10}$/.test(cleanUpi)) {
    cleanUpi = `${cleanUpi}@paytm`; // Default fallback handle for mobile numbers
  }

  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(transactionNote);

  let uri = `upi://pay?pa=${cleanUpi}&pn=${encodedName}&tn=${encodedNote}&cu=INR`;

  if (amount !== undefined) {
    const formattedAmount = typeof amount === 'number' ? amount.toFixed(2) : amount;
    uri += `&am=${formattedAmount}`;
  }

  return uri;
};
