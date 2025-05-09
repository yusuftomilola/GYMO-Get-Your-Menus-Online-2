import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  RequestTimeoutException,
  Logger,
} from '@nestjs/common';

// Extendable error context type
type ErrorHandlingContext = {
  type?: 'database' | 'network' | 'external-api';
  message?: string;
};

const logger = new Logger('DatabaseErrorHandler');

export function handleDatabaseError(
  error: any,
  context: ErrorHandlingContext = {},
): never {
  const contextType = context.type || 'database';
  const contextMessage = context.message || 'An unexpected error occurred';
  const errorMessage = error?.message || error?.detail || contextMessage;

  logger.error(
    `[${contextType.toUpperCase()} ERROR] ${contextMessage}`,
    error?.stack || '',
  );

  if (contextType === 'database') {
    const errorCode = error?.code;

    // PostgreSQL error codes
    switch (errorCode) {
      case '23505': // unique_violation
        throw new ConflictException('Duplicate entry: ' + errorMessage);
      case '23502': // not_null_violation
        throw new BadRequestException(
          'Missing required field: ' + errorMessage,
        );
      case '57014': // query_canceled (can indicate timeout)
        throw new RequestTimeoutException('Query cancelled or timed out');
    }

    // Timeout pattern fallback (driver-agnostic)
    if (error?.name === 'QueryTimeoutError' || error?.code === 'ETIMEDOUT') {
      throw new RequestTimeoutException('Database request timed out');
    }

    // Common fallback pattern matching
    if (errorMessage.includes('duplicate') || errorMessage.includes('UNIQUE')) {
      throw new ConflictException('Duplicate entry: ' + errorMessage);
    }

    if (errorMessage.includes('not-null')) {
      throw new BadRequestException('Missing required field: ' + errorMessage);
    }
  }

  // Log unrecognized structure for diagnostics
  logger.warn('Unhandled error structure:', JSON.stringify(error, null, 2));

  throw new InternalServerErrorException(errorMessage);
}
