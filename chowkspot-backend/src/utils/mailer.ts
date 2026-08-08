// FILE: src/utils/mailer.ts
import nodemailer from 'nodemailer';
import { env } from '@/config/env.js';
import { logger } from '@/utils/logger.js';
import {
  getEmailWrapper,
  getVerificationContent,
  getPasswordResetContent,
} from '@/utils/email-templates.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
  tls: {
    servername: 'smtp.gmail.com',
    rejectUnauthorized: true,
  },
  connectionTimeout: 20000, // 20s
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

export const sendVerificationEmail = async (
  toEmail: string,
  rawToken: string,
  name: string,
) => {
  const content = getVerificationContent(name, toEmail, rawToken);
  const html = getEmailWrapper('Verify Your ChowkSpot Account', content);

  const mailOptions = {
    from: `"ChowkSpot Marketplace" <${env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Verify Your ChowkSpot Account & Unlock Local Pros',
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`📧 Verification email successfully sent to ${toEmail}`);
  } catch (error) {
    logger.error(error as Error, `❌ Failed to send verification email to ${toEmail}`);
  }
};

export const sendPasswordResetEmail = async (
  toEmail: string,
  rawToken: string,
  name: string,
) => {
  const content = getPasswordResetContent(name, toEmail, rawToken);
  const html = getEmailWrapper('Reset Your ChowkSpot Password', content);

  const mailOptions = {
    from: `"ChowkSpot Security" <${env.MAIL_USER}>`,
    to: toEmail,
    subject: 'Security: Reset Your ChowkSpot Password',
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`📧 Password reset email successfully sent to ${toEmail}`);
  } catch (error) {
    logger.error(error as Error, `❌ Failed to send password reset email to ${toEmail}`);
  }
};
