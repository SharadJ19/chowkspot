import { useState } from 'react';
import { buildUpiUri } from '@/utils/upi';

export const useUpiPayment = () => {
  const [activePayment, setActivePayment] = useState<{
    upiId: string;
    payeeName: string;
    amount?: number | undefined;
    uri: string;
  } | null>(null);

  const initiatePayment = (upiId: string, payeeName: string, amount?: number) => {
    const uri = buildUpiUri({ upiId, payeeName, amount });
    setActivePayment({ upiId, payeeName, amount, uri });
  };

  const clearPayment = () => setActivePayment(null);

  return {
    activePayment,
    initiatePayment,
    clearPayment,
  };
};
