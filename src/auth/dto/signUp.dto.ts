import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 30)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  surname: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 30)
  password: string;
}
