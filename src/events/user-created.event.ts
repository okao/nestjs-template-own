import { OnEvent } from '@nestjs/event-emitter';

export class UserCreatedEvent {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly createdAt: Date,
  ) {}

  toString(): string {
    return `UserCreatedEvent: ${this.id} ${this.username} ${this.email} ${this.createdAt}`;
  }

  toJSON(): string {
    return JSON.stringify({
      id: this.id,
      username: this.username,
      email: this.email,
      createdAt: this.createdAt,
    });
  }
}
