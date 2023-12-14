import { ApiProperty } from '@nestjs/swagger';

class SiteSetting {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class Dashboard {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  //has many site settings (one to many) relationship but may be empty
  @ApiProperty()
  siteSettings?: SiteSetting[];
}

export { SiteSetting, Dashboard };
