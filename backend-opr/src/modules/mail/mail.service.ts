import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public async send(sendOptions?: ISendMailOptions): Promise<void> {
    try {
      return await this.mailerService.sendMail(sendOptions);
      // return await this.mailerService.sendMail({
      //   to: 'ra105416@uem.br',
      //   from: 'PeerVise',
      //   subject: 'Novo artigo para revisão',
      //   template: MailTemplate.NewArticle,
      //   context: {
      //     name: 'Henrique Fonseca',
      //     event: 'Evento das eleições motivacionais',
      //     article: '100 lulas contra 150 bolsonaros, lulas estão motivados',
      //   },
      // });
    } catch (e) {
      console.log(e);
    }
  }
}
