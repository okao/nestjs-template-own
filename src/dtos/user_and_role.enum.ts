import { ApiProperty } from '@nestjs/swagger';

interface Roles {
  ADMIN: string;
  USER: string;
}

const RolesConstant: Roles = {
  ADMIN: 'admin',
  USER: 'user',
};

enum RolesEnum {
  ADMIN = 'admin',
  USER = 'user',
}

class RoleType {
  @ApiProperty({
    description: 'Role Type',
    required: true,
    default: RolesEnum.USER,
    type: RolesEnum,
  })
  name!: RolesEnum;
}

export { RolesConstant, RolesEnum, RoleType };
