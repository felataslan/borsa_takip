import nodemailer from 'nodemailer';

/**
 * Common interface for notification providers
 */
export interface NotificationProvider {
  sendEmail?(params: { to: string; subject: string; text: string; html?: string }): Promise<{ success: boolean; error?: unknown }>;
  sendSms?(params: { phone: string; message: string }): Promise<{ success: boolean; error?: unknown }>;
}

/**
 * SMTP Email Provider (Nodemailer)
 */
class SmtpEmailProvider implements NotificationProvider {
  async sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.warn('SMTP settings missing. Email log:', { to, subject, text });
      return { success: true, logged: true };
    }

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Borsa Takip" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html: html || text,
      });

      return { success: true };
    } catch (error) {
      console.error('SMTP Email delivery failed:', error);
      return { success: false, error };
    }
  }
}

/**
 * Simulated SMS Provider for Development
 */
class ConsoleSmsProvider implements NotificationProvider {
  async sendSms({ phone, message }: { phone: string; message: string }) {
    console.log(`[CONSOLE SMS PROVIDER] ${phone}: ${message}`);
    return { success: true };
  }
}

/**
 * Netgsm SMS Provider (Placeholder for actual implementation)
 */
class NetgsmSmsProvider implements NotificationProvider {
  async sendSms({ phone, message }: { phone: string; message: string }) {
    console.log(`[NETGSM PROVIDER - PLAN] Sending to ${phone}: ${message}`);
    // Actual Netgsm API call would go here
    return { success: true, simulated: true };
  }
}

/**
 * Notification Service Registry
 * Switches between providers based on environment or configuration
 */
class NotificationService {
  private emailProvider: NotificationProvider;
  private smsProvider: NotificationProvider;

  constructor() {
    // Default providers
    this.emailProvider = new SmtpEmailProvider();
    
    // Switch SMS provider based on env
    const smsType = process.env.SMS_PROVIDER || 'console';
    if (smsType === 'netgsm') {
      this.smsProvider = new NetgsmSmsProvider();
    } else {
      this.smsProvider = new ConsoleSmsProvider();
    }
  }

  async sendEmail(params: Parameters<NonNullable<NotificationProvider['sendEmail']>>[0]) {
    if (!this.emailProvider.sendEmail) return { success: false, error: 'Provider does not support email' };
    return this.emailProvider.sendEmail(params);
  }

  async sendSms(params: Parameters<NonNullable<NotificationProvider['sendSms']>>[0]) {
    if (!this.smsProvider.sendSms) return { success: false, error: 'Provider does not support SMS' };
    return this.smsProvider.sendSms(params);
  }
}

export const notificationService = new NotificationService();
