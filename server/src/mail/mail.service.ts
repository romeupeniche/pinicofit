import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface SendMailInput {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;
  private from: string | null = null;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const port = Number(this.configService.get<string>('SMTP_PORT') || 587);
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');
    const from = this.configService.get<string>('MAIL_FROM');

    if (host && user && pass && from) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        pool: true,
        maxConnections: 3,
        maxMessages: 50,
        auth: {
          user,
          pass,
        },
      });
      this.from = from;
    }
  }

  isConfigured() {
    return Boolean(this.transporter && this.from);
  }

  private ensureConfigured() {
    if (!this.transporter || !this.from) {
      throw new ServiceUnavailableException(
        'Email is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM on the server.',
      );
    }
  }

  async sendMail({ to, subject, html }: SendMailInput) {
    this.ensureConfigured();

    await this.transporter!.sendMail({
      from: this.from!,
      to,
      subject,
      html,
    });
  }
}
