import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async send(sendOptions?: ISendMailOptions): Promise<void> {
    try {
      return await this.mailerService.sendMail(sendOptions);
    } catch (e) {
      console.log(e);
    }
  }
}
