import { SetMetadata } from '@nestjs/common';

export const redisCacheKeyType = 'redisCacheKeyType';
export const RedisCacheKey = ({
  key,
  value,
  main,
  time,
}: {
  key: string;
  value: string[];
  main: string;
  time?: number;
}) =>
  SetMetadata(redisCacheKeyType, {
    key: key,
    value: value,
    main: main,
    time: time,
  });
