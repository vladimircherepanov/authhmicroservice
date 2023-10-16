import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  private readonly secretKey: string = process.env.JWT_SECRET;
  private readonly expires: string = process.env.JWT_EXPIRES;
  private readonly refreshExpires: string = process.env.JWT_REFRESH_EXPIRES;

  async signUp(signUpData) {
    const { email } = signUpData;
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      const payload = await this.usersService.create(signUpData);
      return {
        accessToken: await this.jwtService.signAsync(payload, {
          secret: this.secretKey,
          expiresIn: this.expires,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          secret: this.secretKey,
          expiresIn: this.refreshExpires,
        }),
      };
    } else throw new UnprocessableEntityException('Email already in use');
  }

  async login(loginData) {
    const { email, password } = loginData;
    const user = await this.usersService.getByEmail(email);
    if (user) {
      const passwordCheck = await bcrypt.compare(password, user.user.password);
      if (passwordCheck) {
        const { id, email, firstname, surname, role } = user.user;
        const payload = { id, email, firstname, surname, role };
        return {
          accessToken: await this.jwtService.signAsync(payload, {
            secret: this.secretKey,
            expiresIn: this.expires,
          }),
          refreshToken: await this.jwtService.signAsync(payload, {
            secret: this.secretKey,
            expiresIn: this.refreshExpires,
          }),
        };
      } else throw new ForbiddenException('Login or password wrong');
    } else throw new NotFoundException('User not found');
  }

  async social(socialData) {
    const { email, password } = socialData;
    return email;
  }

  async refresh(refreshUserDto): Promise<{ accessToken }> {
    try {
      const payload = await this.jwtService.verifyAsync(
        refreshUserDto.refreshToken,
        {
          secret: this.secretKey,
        },
      );

      delete payload.iat;
      delete payload.exp;

      const newAccessToken = await this.jwtService.signAsync(payload, {
        secret: this.secretKey,
        expiresIn: this.expires,
      });
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }
}
