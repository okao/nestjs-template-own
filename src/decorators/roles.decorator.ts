import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from '../dtos/user_and_role.enum';

export const ROLES_KEY = 'roles';
export const RolesDecorator = (...roles: RolesEnum[]) =>
  SetMetadata(ROLES_KEY, roles);
