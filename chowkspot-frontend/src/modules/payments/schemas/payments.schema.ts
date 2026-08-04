import { z } from 'zod';

export const upiPaymentSchema = z.object({
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'Provide a valid UPI ID (e.g. name@upi)'),
  payeeName: z.string().min(1, 'Payee name is required'),
  amount: z.number().positive().optional(),
});
