import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'infogames.trtn@gmail.com',
          pass: 'undo nhty gdoj oyvz',
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}