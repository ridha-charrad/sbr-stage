import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { cyberpunkTemplate } from './templates/cyberpunk.template';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendWelcomeEmail(email: string, firstName: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Nexus',
      html: `
        <h1>Welcome ${firstName}</h1>
        <p>Your account has been created successfully.</p>
      `,
    });
  }
    async sendUpdateNotification(email: string, firstName: string) {
    await this.mailerService.sendMail({
        to: email,
        subject: 'Account Updated',
        html: `
        <h2>Hello ${firstName}</h2>
        <p>Your account information was updated successfully.</p>
        `,
    });
    }

    async sendMail(options: { to: string; subject: string; html?: string; text?: string }) {
        return this.mailerService.sendMail(options as any);
    }




    async sendLoginNotification(email: string, firstName: string) {
    await this.mailerService.sendMail({
        to: email,
        subject: '⚡ New Login Detected | Nexus Secure Zone',
        html: cyberpunkTemplate(`
        
            <h2 style="color:#FCEE0A;">
            Welcome back, Operator.
            </h2>

            <p>
            A successful authentication event was detected on your Nexus account.
            </p>

            <div style="
            background:#141414;
            border-left:4px solid #00F0FF;
            padding:15px;
            margin:20px 0;
            ">
            <strong>ACCESS STATUS:</strong> VERIFIED<br>
            <strong>SECURITY LEVEL:</strong> GREEN<br>
            <strong>TIMESTAMP:</strong> ${new Date().toLocaleString()}
            </div>

            <p>
            If this activity wasn't initiated by you, secure your account immediately.
            </p>
        `),
    });
    }

    async sendPasswordResetLink(email: string, token: string) {
    const link = `http://localhost:3000/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
        to: email,
        subject: '🧬 Password Reset Protocol Activated',
        html: cyberpunkTemplate(`

        <h2 style="color:#FF2E88;">
        Credential Recovery Requested
        </h2>

        <p>
        A request was received to reset the password associated with your Nexus account.
        </p>

        <p>
        For your protection, this recovery link expires in 10 minutes.
        </p>

        <div style="text-align:center;margin:30px 0;">
        <a href="${link}"
            style="
            background:#FCEE0A;
            color:#000;
            text-decoration:none;
            padding:14px 28px;
            font-weight:bold;
            border-radius:4px;
            display:inline-block;
            text-transform:uppercase;
            letter-spacing:1px;
            ">
            Initialize Password Reset
        </a>
        </div>

        <p style="font-size:12px;color:#888;">
        If you did not request this action, no further steps are required.
        </p>
        `),
    });
    }
    async sendVerificationEmail(
    email: string,
    firstName: string,
    token: string,
    ) {
    const link =
        `http://localhost:3000/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail({
        to: email,
        subject: '⚡ Verify Your Nexus Account',
        html: cyberpunkTemplate(`
        <h2 style="color:#FCEE0A">
            Welcome to Nexus, ${firstName}
        </h2>

        <p>
            Your account has been created successfully.
        </p>

        <p>
            Before entering the marketplace, verify your identity.
        </p>

        <div style="text-align:center;margin:30px 0;">
            <a href="${link}"
            style="
                background:#FCEE0A;
                color:#000;
                padding:14px 28px;
                text-decoration:none;
                font-weight:bold;
                border-radius:6px;
            ">
            VERIFY ACCOUNT
            </a>
        </div>

        <p>
            This verification link expires in 24 hours.
        </p>
        `),
    });
    }
}