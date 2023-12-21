import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNumberString,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

class SignIn {
  id?: number;

  @ApiProperty({
    description: 'The username of the user',
    required: true,
  })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long' })
  username!: string;

  @ApiProperty({
    description: 'The password of the user',
    required: true,
  })
  password!: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email' })
  email?: string;
}

class SignUp {
  @ApiProperty({
    description: 'The username of the user',
    required: true,
  })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(20, { message: 'Username must be at most 20 characters long' })
  @IsAlphanumeric(undefined, { message: 'Username must be alphanumeric' })
  username!: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
  })
  @IsEmail({}, { message: 'Invalid email' })
  email!: string;

  @ApiProperty({
    description: 'The password of the user',
    required: true,
  })
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'password must be at least 8 characters long, contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol',
    },
  )
  password!: string;

  @ApiProperty({
    description: 'Name of the user',
    required: true,
  })
  @IsString({ message: 'Name must be a string' })
  name!: string;
}

class RefreshTokenType {
  @ApiProperty({
    description: 'The refresh token of the user',
    required: true,
  })
  refreshToken!: string;
}

export { SignIn, RefreshTokenType, SignUp };
