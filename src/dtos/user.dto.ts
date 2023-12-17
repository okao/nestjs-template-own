import { ApiBody, ApiProperty } from '@nestjs/swagger';
import {
  Contains,
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MinLength,
} from 'class-validator';
// import { RolesConstant, RoleType, RolesEnum } from './user_and_role.enum';

// class CreateRole {
//   @ApiProperty({
//     description: 'The role of the user',
//     required: true,
//   })
//   name!: typeof RolesConstant;
// }

// interface Roles {
//   ADMIN: string;
//   USER: string;
// }

enum RolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}

class RoleType {
  name!: RolesEnum;
}

class CreateUser {
  @ApiProperty({
    description: 'The username of the user',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'The email of the user',
    required: true,
    type: String,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Password of the user',
    required: true,
    type: String,
  })
  @MinLength(8)
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
        'Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol',
    },
  )
  password!: string;

  @ApiProperty({
    description: 'Role Type',
    required: true,
    default: RolesEnum.USER,
    type: String,
  })
  @IsNotEmpty()
  role!: RolesEnum;
}

export { CreateUser };
