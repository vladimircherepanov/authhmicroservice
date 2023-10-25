import { IsString } from 'class-validator';

export class GoogleTokenDto {
  @IsString()
  googleToken: string;
}
