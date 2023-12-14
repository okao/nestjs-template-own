import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
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

  console.log({ settings });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
