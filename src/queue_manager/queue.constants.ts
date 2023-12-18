export const QUEUE_MANAGER = {
  name: 'QUEUE_MANAGER',
};

export const FILE_UPLOAD_QUEUE = {
  name: 'FILE_UPLOAD_QUEUE',
};

export interface QueueOptions {
  name: 'InitialQueue' | string;
  data: unknown;
  options?: {
    delay: 1000 | number;
    removeOnComplete: true | boolean;
    removeOnFail: true | boolean;
    attempts?: 1 | number;
    repeat?: {
      every: 10000 | number;
      limit: 0 | number;
    };
    backoff?: {
      type: 'fixed' | string;
      delay: 10000 | number;
    };
  };
}

export const IinitilQueue = {
  name: 'InitialQueue',
};

export const SendEmailQueue = {
  name: 'SendEmailQueue',
};

export interface QueueEvent {
  id: string;
  username?: string;
  email: string;
  options?: unknown;
}
