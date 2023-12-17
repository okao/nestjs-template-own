import { ApiProperty } from '@nestjs/swagger';

class SignIn {
  id?: number;

  @ApiProperty({
    description: 'The username of the user',
    required: true,
  })
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
  email!: string;
}

class RefreshTokenType {
  @ApiProperty({
    description: 'The refresh token of the user',
    required: true,
  })
  refreshToken!: string;
}

export { SignIn, RefreshTokenType };
