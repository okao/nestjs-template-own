import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { RolesEnum } from 'src/dtos/user_and_role.enum';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = request;

    let hasRole = false;
    requiredRoles.forEach((role) => {
      console.log('role', role);
      console.log('user.roles', user?.roles);
      // if (role === user?.role?.name) {
      //   hasRole = true;
      // }
      user?.roles?.forEach((usersRole) => {
        if (role === usersRole?.role?.name) {
          hasRole = true;
        }
      });
    });

    console.log('hasRole', hasRole);

    return hasRole;
  }

  private validateRequest(request: Request): boolean {
    // const { user } = request;
    // const { roles } = user;
    // return roles.some((role) => role === 'admin');

    return false;
  }
}
