import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "admin@turbinenexus.com";
const FROM_EMAIL = "Turbine Nexus <noreply@turbinenexus.com>";

interface InquiryEmailParams {
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  message: string;
  equipmentTitle?: string | null;
}

export async function sendInquiryNotification(params: InquiryEmailParams) {
  const subject = params.equipmentTitle
    ? `New Inquiry: ${params.equipmentTitle} — ${params.companyName}`
    : `New General Inquiry — ${params.companyName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: #1B3A5C; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">New Inquiry Received</h1>
        <p style="color: #94a3b8; margin: 4px 0 0;">Turbine Nexus CRM</p>
      </div>
      <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        ${params.equipmentTitle ? `<p style="background: #fffbeb; border: 1px solid #f59e0b; padding: 12px; border-radius: 6px; color: #92400e;"><strong>Equipment of Interest:</strong> ${params.equipmentTitle}</p>` : ""}
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 140px;">Company</td><td style="padding: 8px 0; font-weight: bold;">${params.companyName}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Contact</td><td style="padding: 8px 0;">${params.contactName}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${params.contactEmail}" style="color: #1B3A5C;">${params.contactEmail}</a></td></tr>
          ${params.contactPhone ? `<tr><td style="padding: 8px 0; color: #64748b;">Phone</td><td style="padding: 8px 0;">${params.contactPhone}</td></tr>` : ""}
        </table>
        <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-radius: 6px;">
          <p style="color: #64748b; margin: 0 0 8px; font-size: 14px;">MESSAGE</p>
          <p style="margin: 0; color: #1e293b;">${params.message.replace(/\n/g, "<br>")}</p>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <a href="${process.env.NEXTAUTH_URL}/admin/inquiries" style="background: #1B3A5C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px;">View in CRM Dashboard →</a>
        </div>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 16px;">© ${new Date().getFullYear()} Turbine Nexus — All rights reserved</p>
    </div>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [NOTIFICATION_EMAIL],
    reply_to: params.contactEmail,
    subject,
    html,
  });
}

export async function sendInquiryConfirmation(params: InquiryEmailParams) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
      <div style="background: #1B3A5C; padding: 24px; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Thank You for Your Inquiry</h1>
        <p style="color: #94a3b8; margin: 4px 0 0;">Turbine Nexus — Global Power Asset Specialists</p>
      </div>
      <div style="background: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        <p>Dear ${params.contactName},</p>
        <p>Thank you for reaching out to Turbine Nexus. We have received your inquiry${params.equipmentTitle ? ` regarding the <strong>${params.equipmentTitle}</strong>` : ""} and a member of our team will be in touch within one business day.</p>
        <p>In the meantime, if you have any urgent requirements, please contact us directly:</p>
        <p style="background: #fffbeb; border: 1px solid #f59e0b; padding: 12px; border-radius: 6px;">
          📧 <a href="mailto:sales@turbinenexus.com" style="color: #1B3A5C;">sales@turbinenexus.com</a>
        </p>
        <p>Best regards,<br><strong>The Turbine Nexus Team</strong></p>
      </div>
    </div>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: [params.contactEmail],
    subject: "Your inquiry has been received — Turbine Nexus",
    html,
  });
}
