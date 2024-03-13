import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailDataRequired, MailService } from '@sendgrid/mail';
import ms from 'ms';

import { Templates } from './enum';

@Injectable()
export class SendgridService {
  private readonly sgMail: MailService;

  constructor(private readonly configService: ConfigService) {
    this.sgMail = new MailService();
    this.sgMail.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const mail: MailDataRequired = {
      from: this.configService.get<string>('EMAIL_SENDER_ADDRESS'),
      templateId: Templates.PasswordReset,
      personalizations: [
        {
          to: [
            {
              email,
            },
          ],
          dynamicTemplateData: {
            token,
            expireTime: ms(
              ms(
                this.configService.get<string>(
                  'PASSWORD_RESET_TOKEN_EXPIRATION',
                ),
              ),
              { long: true },
            ),
          },
        },
      ],
    };

    await this.sendEmail(mail);
  }

  async sendPasswordChange(email: string, token: string): Promise<void> {
    const mail: MailDataRequired = {
      from: this.configService.get<string>('EMAIL_SENDER_ADDRESS'),
      templateId: Templates.PasswordChange,
      personalizations: [
        {
          to: [
            {
              email,
            },
          ],
          dynamicTemplateData: {
            token,
            expireTime: ms(
              ms(
                this.configService.get<string>(
                  'PASSWORD_CHANGE_TOKEN_EXPIRATION',
                ),
              ),
              { long: true },
            ),
          },
        },
      ],
    };

    await this.sendEmail(mail);
  }

  async sendEmailVerification(email: string, token: string): Promise<void> {
    const mail: MailDataRequired = {
      from: this.configService.get<string>('EMAIL_SENDER_ADDRESS'),
      templateId: Templates.EmailVerification,
      personalizations: [
        {
          to: [
            {
              email,
            },
          ],
          dynamicTemplateData: {
            token,
          },
        },
      ],
    };

    await this.sendEmail(mail);
  }

  private async sendEmail(mail: MailDataRequired) {
    return await this.sgMail.send(mail);
  }
}
