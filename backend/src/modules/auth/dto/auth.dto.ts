import { IsEmail, IsString, MinLength, IsPhoneNumber } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsPhoneNumber("ZZ") // "ZZ" for international phone numbers, adjust if specific country needed
  phone: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

