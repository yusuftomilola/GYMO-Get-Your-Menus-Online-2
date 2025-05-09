import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';

// A utility function to handle database related errors in the services.
export function handleDatabaseError(
  error: any,
  contextMessage = 'An unexpected error occured',
): never {
  const errorMessage = error?.message || error?.detail || contextMessage;

  if (errorMessage.includes('duplicate') || errorMessage.includes('UNIQUE')) {
    throw new ConflictException('Duplicate entry:' + errorMessage);
  }

  if (errorMessage.includes('not-null')) {
    throw new BadRequestException('Missing required field:' + errorMessage);
  }

  if (error?.name === 'QueryTimeoutError' || error?.code === 'ETIMEDOUT') {
    throw new RequestTimeoutException('Database request timed out');
  }

  // catch all

  throw new InternalServerErrorException(errorMessage);
}
