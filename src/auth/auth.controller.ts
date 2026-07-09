import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('request-password-reset')
  requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }
  @Get('verify-email')
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('reset-password')
  resetPassword(@Query('token') token: string) {
    return this.authService.verifyResetToken(token);
  }

  @Post('reset-password')
  resetPasswordConfirm(
    @Body() body: { token: string; newPassword: string },
  ) {
    return this.authService.resetPassword(
      body.token,
      body.newPassword,
    );
  }
  @Post('resend-verification')
  resendVerification(@Body() body: { email: string }) {
    return this.authService.resendVerificationEmail(body.email);
  }
}