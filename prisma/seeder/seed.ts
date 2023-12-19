import { AuthProvider, PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// import { PrismaClient } from '../../src/lib/db/client';

// initialize Prisma Client
const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  // const emailClientSecret = await bcrypt('eZd8eHpfQ4s6az-0/^v2aHTP:nc|tc', saltRounds).then((hash) => hash);
  const emailClientSecret = await bcrypt.hash(
    'eZd8eHpfQ4s6az-0/^v2aHTP:nc|tc',
    saltRounds,
  );
  const userPassword = await bcrypt.hash('welcome', saltRounds);
  // create dummy data
  const settings = await prisma.siteSetting.createMany({
    data: [
      {
        name: 'site_name',
        value: 'My Site',
      },
      {
        name: 'site_description',
        value: 'My Site Description',
      },
      {
        name: 'site_logo',
        value: 'My Site Logo',
      },
      {
        name: 'site_favicon',
        value: 'My Site Favicon',
      },
      {
        name: 'site_keywords',
        value: 'My Site Keywords',
      },
      {
        name: 'site_author',
        value: 'My Site Author',
      },
      {
        name: 'site_url',
        value: 'My Site URL',
      },
      {
        name: 'site_email',
        value: 'My Site Email',
      },
      {
        name: 'site_phone',
        value: 'My Site Phone',
      },
      {
        name: 'site_address',
        value: 'My Site Address',
      },
      {
        name: 'site_city',
        value: 'My Site City',
      },
      {
        name: 'site_country',
        value: 'My Site Country',
      },
      {
        name: 'site_zipcode',
        value: 'My Site Zipcode',
      },
      {
        name: 'site_timezone',
        value: 'My Site Timezone',
      },
      {
        name: 'site_currency',
        value: 'My Site Currency',
      },
      {
        name: 'site_language',
        value: 'My Site Language',
      },
      {
        name: 'site_status',
        value: 'My Site Status',
      },
      {
        name: 'site_maintenance',
        value: 'My Site Maintenance',
      },
      {
        name: 'site_maintenance_message',
        value: 'My Site Maintenance Message',
      },
      {
        name: 'site_maintenance_start',
        value: 'My Site Maintenance Start',
      },
      {
        name: 'site_maintenance_end',
        value: 'My Site Maintenance End',
      },
      {
        name: 'site_google_analytics',
        value: 'My Site Google Analytics',
      },
      {
        name: 'site_google_recaptcha',
        value: 'My Site Google Recaptcha',
      },
      {
        name: 'site_google_recaptcha_key',
        value: 'My Site Google Recaptcha Key',
      },
    ],
    skipDuplicates: true,
  });

  //seed roles
  const rolTypes = [
    {
      name: 'user',
      defaultType: true,
      description: 'User Role',
      active: true,
    },
    {
      name: 'admin',
      defaultType: false,
      description: 'Admin Role',
      active: true,
    },
  ] as Role[];

  const roles = await prisma.role.createMany({
    data: rolTypes,
    skipDuplicates: true,
  });

  const statusTypes = [
    {
      name: 'active',
      description: 'Active Status',
    },
    {
      name: 'inactive',
      description: 'Inactive Status',
    },
    {
      name: 'deleted',
      description: 'Deleted Status',
    },
    {
      name: 'banned',
      description: 'Banned Status',
    },
    {
      name: 'pending',
      description: 'Pending Status',
    },
    {
      name: 'draft',
      description: 'Draft Status',
    },
  ];

  const statuses = await prisma.status.createMany({
    data: statusTypes,
    skipDuplicates: true,
  });

  //authProviders
  const authProviderTypes = [
    {
      name: 'email',
      description: 'Email Auth Provider',
      loginUrl: 'http://localhost:3000/auth/login',

      clientId: '018c6c56-f728-71ab-aa96-00a0f572de12',
      clientSecret: emailClientSecret,
    },
    {
      name: 'facebook',
      description: 'Facebook Auth Provider',
      loginUrl: 'https://www.facebook.com',
    },
    {
      name: 'google',
      description: 'Google Auth Provider',
      loginUrl: 'https://accounts.google.com/v3/signin',
    },
    {
      name: 'x',
      description: 'X-(Twitter) Auth Provider',
      loginUrl: 'https://www.twitter.com',
    },
    {
      name: 'github',
      description: 'Github Auth Provider',
      loginUrl: 'https://github.com/login',
    },
    {
      name: 'linkedin',
      description: 'Linkedin Auth Provider',
      loginUrl: 'https://www.linkedin.com/login',
    },
  ] as AuthProvider[];

  const authProviders = await prisma.authProvider.createMany({
    data: authProviderTypes,
    skipDuplicates: true,
  });

  //default user
  const users = await prisma.user.create({
    data: {
      username: 'okao',
      email: 'hamzathanees@gmail.com',
      password: userPassword,
      status: {
        connect: {
          name: 'active',
        },
      },
    },
    include: {
      roles: true,
      status: true,
    },
  });

  //add roles to user
  await prisma.userRole.createMany({
    data: [
      {
        userId: users.id,
        roleId: (await prisma.role.findFirst({ where: { name: 'user' } })).id,
      },
      {
        userId: users.id,
        roleId: (await prisma.role.findFirst({ where: { name: 'admin' } })).id,
      },
    ],
    skipDuplicates: true,
  });

  console.log({
    settings: settings.count,
    roles: roles.count,
    statuses: statuses.count,
    authProviders: authProviders.count,
    user: users,
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
