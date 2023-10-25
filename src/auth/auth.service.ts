import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map, of, pluck } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  private readonly secretKey: string = process.env.JWT_SECRET;
  private readonly expires: string = process.env.JWT_EXPIRES;
  private readonly refreshExpires: string = process.env.JWT_REFRESH_EXPIRES;

  async createTokens(payload) {
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
  }

  async signUp(signUpData) {
    const { email } = signUpData;
    const user = await this.usersService.getByEmailAndProvider(email, [
      'M',
      'MG',
    ]);
    if (!user) {
      const payload = await this.usersService.create(signUpData);
      return this.createTokens(payload);
    } else throw new UnprocessableEntityException('Email already in use');
  }

  async login(loginData) {
    const { email, password } = loginData;
    const user = await this.usersService.getByEmailAndProvider(email, [
      'M',
      'MG',
    ]);
    if (user) {
      const passwordCheck = await bcrypt.compare(password, user.user.password);
      if (passwordCheck) {
        const { id, email, firstname, surname, role, confirmed } = user.user;
        const payload = { id, email, firstname, surname, role, confirmed };
        return this.createTokens(payload);
      } else throw new ForbiddenException('Login or password wrong');
    } else throw new NotFoundException('User not found');
  }

  public googleTokenData = [];

  async socialGoogle(googleToken) {
    const url =
      'https://oauth2.googleapis.com/tokeninfo?id_token=' +
      googleToken.googleToken.toString();

    const xxx = await this.httpService
      .get(url)
      .pipe(
        map((e) => {
          return {
            email: e.data?.email,
            given_name: e.data?.given_name,
            family_name: e.data?.family_name,
            picture: e.data?.picture,
          };
        }),
      )
      .pipe(catchError((_) => of('Wrong token error')));

    return xxx
  }












  async forgot(forgotData) {}

  async changePassword(forgotData) {}

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
