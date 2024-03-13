import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  LoginDto,
  PasswordChangeDto,
  RequestPasswordChangeDto,
  RequestWithSession,
  RequestWithUser,
  VerifyUserDto,
} from './dtos';
import { JwtAuthGuard, LocalAuthGuard, RefreshAuthGuard } from './guards';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verify(@Body() dto: VerifyUserDto) {
    return await this.authService.verify(dto);
  }

  @Post('request-password-reset')
  async requestPasswordReset(@Body() dto: RequestPasswordChangeDto) {
    return await this.authService.requestPasswordReset(dto);
  }

  @Post('password-reset')
  async passwordReset(@Body() dto: PasswordChangeDto) {
    return await this.authService.passwordReset(dto);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post('request-password-change')
  async requestPasswordChange(@Request() req: RequestWithUser) {
    return await this.authService.requestPasswordChange(req.user);
  }

  @Post('password-change')
  async passwordChange(@Body() dto: PasswordChangeDto) {
    return await this.authService.passwordChange(dto);
  }

  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser) {
    return await this.authService.login(req.user);
  }

  @ApiBearerAuth('RefreshToken')
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refresh(@Request() req: RequestWithSession) {
    return await this.authService.refresh(req.user.session);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: RequestWithUser) {
    return await this.authService.logout(req.user.sessions[0].id);
  }

  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post('global-logout')
  async globalLogout(@Request() req: RequestWithUser) {
    return await this.authService.globalLogout(req.user);
  }
}
