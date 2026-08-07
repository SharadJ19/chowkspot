import { env } from '@/config/env.js';

// Shared Brand Wrapper
export const getEmailWrapper = (title: string, contentHtml: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f8fa; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f6f8fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05);">
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #10b981 0%, #047857 100%);"></td>
          </tr>
          <tr>
            <td style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 26px; font-weight: 800; color: #0f172a; letter-spacing: -1px;">
                chowk<span style="font-weight: 300; color: #0f172a;">spot</span><span style="display: inline-block; width: 6px; height: 6px; background-color: #10b981; border-radius: 50%; margin-left: 2px; vertical-align: middle;"></span>
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px; color: #0f172a; font-size: 15px; line-height: 1.6;">
              ${contentHtml}
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; background-color: #0f172a; color: #94a3b8; font-size: 12px; line-height: 1.5; text-align: center;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #f8fafc;">ChowkSpot Service Marketplace</p>
              <p style="margin: 0 0 12px 0;">Connecting residents directly with skilled local pros across Himachal &amp; Tricity • 0% Commission</p>
              <p style="margin: 0; color: #64748b;">Plot 42, Sector 17-E, Chandigarh Tech Enclave, UT 160017</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const getVerificationContent = (
  name: string,
  toEmail: string,
  rawToken: string,
) => {
  const verificationUrl = `${env.CLIENT_ORIGIN || 'http://localhost:5173'}/verify-email?token=${rawToken}&email=${encodeURIComponent(toEmail)}`;

  return `
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Welcome to ChowkSpot, ${name}! 🎉</h2>
    <p style="margin: 0 0 16px 0; color: #334155;">You're just one step away from connecting directly with trusted local electricians, plumbers, and skilled service experts with <strong>zero platform commission</strong>.</p>
    <p style="margin: 0 0 24px 0; color: #334155;">Please verify your email address to unlock full marketplace access, direct bookings, and secure P2P UPI settlements.</p>

    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #10b981;">
          <a href="${verificationUrl}" target="_blank" style="font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; border: 1px solid #10b981; display: inline-block; background: linear-gradient(135deg, #10b981 0%, #047857 100%); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);">Verify Email Address</a>
        </td>
      </tr>
    </table>

    <p style="color: #64748b; font-size: 13px; margin: 24px 0 0 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      This verification link is secure and valid for <strong>24 hours</strong>. If you did not create a ChowkSpot account, you can safely ignore this email.
    </p>
  `;
};

export const getPasswordResetContent = (
  name: string,
  toEmail: string,
  rawToken: string,
) => {
  const resetUrl = `${env.CLIENT_ORIGIN || 'http://localhost:5173'}/reset-password?token=${rawToken}&email=${encodeURIComponent(toEmail)}`;

  return `
    <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 16px;">Password Reset Request</h2>
    <p style="margin: 0 0 16px 0; color: #334155;">Hello <strong>${name}</strong>, we received a request to reset the password for your ChowkSpot account.</p>
    <p style="margin: 0 0 24px 0; color: #334155;">Click the secure button below to choose a new password. For security, this link will expire in 15 minutes.</p>

    <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
      <tr>
        <td align="center" style="border-radius: 8px; background-color: #0f172a;">
          <a href="${resetUrl}" target="_blank" style="font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; border: 1px solid #0f172a; display: inline-block; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2);">&#128272; Reset Password</a>
        </td>
      </tr>
    </table>

    <p style="color: #64748b; font-size: 13px; margin: 24px 0 0 0; border-top: 1px solid #f1f5f9; padding-top: 16px;">
      If you did not request a password reset, please ignore this email or contact support immediately. Your current password remains unchanged.
    </p>
  `;
};
