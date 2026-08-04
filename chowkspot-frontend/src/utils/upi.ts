// Deep-link UPI URI builder (upi://pay?pa=...)

interface UpiPaymentParams {
  upiId: string;
  payeeName: string;
  amount?: string | number;
  transactionNote?: string;
}

export const buildUpiUri = ({
  upiId,
  payeeName,
  amount,
  transactionNote = 'Payment via ChowkSpot',
}: UpiPaymentParams): string => {
  const encodedName = encodeURIComponent(payeeName);
  const encodedNote = encodeURIComponent(transactionNote);

  let uri = `upi://pay?pa=${upiId}&pn=${encodedName}&tn=${encodedNote}&cu=INR`;

  if (amount) {
    const formattedAmount = typeof amount === 'number' ? amount.toFixed(2) : amount;
    uri += `&am=${formattedAmount}`;
  }

  return uri;
};
