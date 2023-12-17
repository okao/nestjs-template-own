import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class InterceptorRequestAssociateNeededTsInterceptor
  implements NestInterceptor
{
  private logger = new Logger(
    InterceptorRequestAssociateNeededTsInterceptor.name,
  );

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('InterceptorRequestAssociateNeededTsInterceptor');
    const request = context.switchToHttp().getRequest();
    //get the user from the request object
    const user = request?.user;

    //add the ip address to the request object
    // request.ip =
    //   request?.headers?.['x-forwarded-for'] ||
    //   request?.connection?.remoteAddress;

    //add the user agent to the request object
    request.userAgent = request.headers['user-agent'];

    //add the user id to the request object
    request.userId = user?.id;

    //add the user role to the request object
    request.userRoleId = user?.roleId;

    const method = request.method;
    const url = request.url;
    const statusCode = request.statusCode;
    const contentLength = request.contentLength;
    const userAgent = request.userAgent;
    const ip = request?.ip || request?.connection?.remoteAddress;

    this.logger.log(
      `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
    );

    return next.handle();
  }
}
