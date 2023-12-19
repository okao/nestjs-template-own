import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUser } from '../../dtos/user.dto';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { RolesEnum } from '../../dtos/user_and_role.enum';
import { AccessTokenGuard } from 'src/api/auth/guards/accessToken.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/events/user-created.event';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadFileTypeValidator } from '../../validators/file.validator';
import { diskStorage } from 'multer';

const MAX_FILE_UPLOAD_SIZE_IN_BYTES = 100 * 1024 * 1024; // 2 MB
const VALID_UPLOADS_MIME_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'text/plain',
];

@ApiHeader({
  name: 'User API',
  description: 'The user API description',
})
@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('/me')
  @UseGuards(AccessTokenGuard)
  async getMe(@AuthUser() user: User): Promise<User> {
    try {
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          errors: {
            message: error.message,
          },
        },
        error.status,
      );
    }
  }

  @Post('create_user')
  @ApiCreatedResponse({
    description: 'User successfully logged in',
  })
  @ApiBody({
    type: CreateUser,
  })
  @UseGuards(AccessTokenGuard, RoleGuard)
  @RolesDecorator(RolesEnum.ADMIN)
  async createUser(@Body() createUserDto: CreateUser): Promise<User> {
    try {
      const user = await this.userService.createUser(createUserDto);
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status || 500,
          errors: {
            message: error?.message,
          },
        },
        error.status,
      );
    }
  }

  //testing controller
  @Get('test')
  async test(): Promise<any> {
    try {
      // const createUserWithRoles = async () => {
      //   await this.prisma
      //     .$executeRaw`SELECT * from "nestjs-template".create_user_with_roles(
      //         'e1ea56d6-5f75-4fe3-a8cf-b8e73199310f',
      //         'hamzathanees8@gmail.com',
      //         'okao8',
      //         'password123',
      //         1,
      //         1,
      //         '2023-12-19 12:34:56'::TIMESTAMP,
      //         ARRAY[
      //             '{"role": {"id": 1}}'::JSON,
      //             '{"role": {"id": 2}}'::JSON
      //         ]
      //     );`;

      //   const resultQ = await this.prisma.user.findMany({
      //     where: {
      //       id: 'e1ea56d6-5f75-4fe3-a8cf-b8e73199310f',
      //     },
      //     include: {
      //       // Include any other fields you want to retrieve
      //       roles: {
      //         include: {
      //           role: true,
      //         },
      //       },
      //     },
      //   });

      //   return resultQ;
      // };

      const createUserWithRoles = async () => {
        const results = await this.prisma.$queryRaw<
          any[]
        >`SELECT "nestjs-template".create_user_with_roles(
    'hamzathanees13@gmail.com',
    'hamzathanees13',
    'password123',
    1,
    1,
    '2023-12-19 12:34:56'::TIMESTAMP,
    ARRAY[
        '{"role": {"id": 1}}'::JSON,
        '{"role": {"id": 2}}'::JSON
    ]
)`;

        return results;
      };

      // const result2 = await createUserWithRoles();

      // return result2;

      return 'testig';
    } catch (error) {
      console.log('error', error);
      throw new HttpException(
        {
          status: error?.status || 500,
          errors: {
            message: error?.message,
          },
        },
        error.status,
      );
    }
  }

  //testing file upload
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: diskStorage({
        destination: './uploads/',
        // filename: file,
        filename: (req, file, cb) => {
          console.log('file', file);
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');

          console.log('randomName', randomName);
          console.log('fullname', `${randomName}${file.originalname}`);
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
      //   fileFilter: imageFileFilter,
    }),
  )
  async uploadFile(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({ maxSize: MAX_FILE_UPLOAD_SIZE_IN_BYTES })
        .addFileTypeValidator({ fileType: 'image/png' })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    ) // new ParseFilePipeBuilder()
    //   .addMaxSizeValidator({ maxSize: MAX_FILE_UPLOAD_SIZE_IN_BYTES })
    files //   .addFileTypeValidator({ fileType: 'image/png' })
    //   .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    // new ParseFilePipeBuilder()
    //   .addValidator(
    //     new FileUploadFileTypeValidator({
    //       fileType: VALID_UPLOADS_MIME_TYPES,
    //       // fileSize: MAX_FILE_UPLOAD_SIZE_IN_BYTES,
    //     }),
    //   )
    //   .addMaxSizeValidator({ maxSize: MAX_FILE_UPLOAD_SIZE_IN_BYTES })
    //   .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),

    // console.log(File),
    : Express.Multer.File[],
  ): Promise<any> {
    try {
      console.log('file', files);
      // const { originalname, buffer, fieldname, encoding, mimetype, size } =
      //   files;

      const response = [];
      files.forEach((file) => {
        const { originalname, mimetype, size, filename } = file;
        const fileObj = {
          originalname,
          mimetype,
          size,
          filename,
        };
        response.push(fileObj);
      });

      return response;
    } catch (error) {
      console.log('error', error);
    }
  }

  @OnEvent('user.created')
  handleUserCreatedEvent(payload: UserCreatedEvent) {
    console.log(
      'UserCreatedEvent',
      payload.id,
      payload.username,
      payload.email,
      payload.createdAt,
    );

    const { id, username, email, createdAt } = payload;

    //add this redis que to send email
    // this.userService.sendEmail(id, username, email, createdAt);
  }
}
