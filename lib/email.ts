import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// All environment variables are safely referenced here.
// Amplify requires these to be set in the Amplify Console Environment variables section.
const sesClient = new SESClient({
  region: process.env.SES_REGION || 'us-east-2',
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY || '',
  },
});

export interface SendTrackingEmailParams {
  to: string;
  trackingNumber: string;
  status: string;
  description: string;
  location?: string;
  estimatedDelivery?: Date;
}

export async function sendTrackingUpdateEmail({
  to,
  trackingNumber,
  status,
  description,
  location,
  estimatedDelivery,
}: SendTrackingEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const fromEmail = process.env.SES_FROM_EMAIL || 'markdietz112@icloud.com';
  const fromName = process.env.SES_FROM_NAME || 'MilwaukeeTrack';

  const subject = `Tracking Update: ${trackingNumber} - ${status}`;

  const htmlBody = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0a0a0a; color: #ededed;">
      <h1 style="color: #0066ff; margin-bottom: 8px;">MilwaukeeTrack</h1>
      <p style="color: #888; font-size: 14px;">Shipment Tracking Update</p>
      
      <div style="background: #111; border-radius: 12px; padding: 24px; margin: 24px 0; border: 1px solid #222;">
        <p style="margin: 0 0 12px 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p style="margin: 0 0 12px 0;"><strong>Status:</strong> <span style="color: #22c55e; font-weight: 600;">${status}</span></p>
        ${location ? `<p style="margin: 0 0 12px 0;"><strong>Location:</strong> ${location}</p>` : ''}
        <p style="margin: 0 0 12px 0;"><strong>Update:</strong> ${description}</p>
        ${estimatedDelivery ? `<p style="margin: 0;"><strong>Est. Delivery:</strong> ${estimatedDelivery.toLocaleDateString()}</p>` : ''}
      </div>

      <p style="color: #666; font-size: 13px;">Track your shipment anytime at <a href="https://your-domain.com" style="color: #0066ff;">MilwaukeeTrack</a></p>
    </div>
  `;

  const textBody = `MilwaukeeTrack Update

Tracking: ${trackingNumber}
Status: ${status}
${location ? `Location: ${location}\n` : ''}Update: ${description}
${estimatedDelivery ? `Est. Delivery: ${estimatedDelivery.toLocaleDateString()}\n` : ''}

Track here: https://your-domain.com`;

  try {
    const command = new SendEmailCommand({
      Source: `${fromName} <${fromEmail}>`,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Html: { Data: htmlBody, Charset: 'UTF-8' },
          Text: { Data: textBody, Charset: 'UTF-8' },
        },
      },
    });

    const result = await sesClient.send(command);
    return { success: true, messageId: result.MessageId };
  } catch (error: any) {
    console.error('SES email error:', error);
    return { success: false, error: error.message || 'Failed to send email' };
  }
}

// Utility to verify SES configuration at runtime (not build time)
export function isEmailConfigured(): boolean {
  return !!(
    process.env.SES_ACCESS_KEY_ID &&
    process.env.SES_SECRET_ACCESS_KEY &&
    process.env.SES_FROM_EMAIL
  );
}
