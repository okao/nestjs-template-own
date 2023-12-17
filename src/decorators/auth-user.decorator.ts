import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';

// function AuthUser() {
//   // return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
//   //   const request = ctx.switchToHttp().getRequest();
//   //   return request.user as UserResponse;
//   // });

//   return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user as UserResponse;
//   });
// }

// export declare const AuthUser: () => ParameterDecorator;

// export function AuthUser(): ParameterDecorator {
//   return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();

//     console.log('request.user: ', request.user);
//     return request.user;
//   });
// }

/**
 * Custom decorator for adding principal to request object.
 *
 * @type {(...dataOrPipes: Type<PipeTransform> | PipeTransform | any[]) => ParameterDecorator}
 */
export const AuthUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
