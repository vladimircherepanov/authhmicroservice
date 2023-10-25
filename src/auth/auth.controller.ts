import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthService } from './auth.service';
import { GoogleTokenDto } from './dto/google-token.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpData: SignUpDto) {
    return await this.authService.signUp(signUpData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginData: LoginDto) {
    return await this.authService.login(loginData);
  }

  @Post('social/google')
  @HttpCode(HttpStatus.CREATED)
  async social(@Body() googleToken: GoogleTokenDto) {
    return this.authService.socialGoogle(googleToken);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.CREATED)
  async refresh(@Body() refreshData: RefreshTokenDto) {
    return await this.authService.refresh(refreshData);
  }

  @Post('forgot')
  @HttpCode(HttpStatus.CREATED)
  async forgot(@Body() forgotData: RefreshTokenDto) {
    return await this.authService.forgot(forgotData);
  }

  @Post('changepassword')
  @HttpCode(HttpStatus.CREATED)
  async changePassword(@Body() forgotData: RefreshTokenDto) {
    return await this.authService.forgot(forgotData);
  }
}
