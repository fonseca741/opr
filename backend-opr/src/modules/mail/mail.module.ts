//app.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { config } from 'src/config/env';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          transport: {
            host: config.mail.smtp,
            port: config.mail.port,
            secure: false,
            auth: {
              pass: config.mail.pass,
              user: config.mail.user,
            },
          },
          defaults: {
            from: '"OpenChair" <openchair@uem.br>',
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(undefined, {
              inlineCssEnabled: true,
            }),
            options: {
              strict: true,
            },
          },
          options: {
            partials: {
              dir: join(__dirname, 'templates/partials'),
              options: {
                strict: true,
              },
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
