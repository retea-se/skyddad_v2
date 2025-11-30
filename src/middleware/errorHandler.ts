import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { config } from '../../config/index.js';

/**
 * Sentry error handler middleware
 */
export const sentryErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (config.features.sentry) {
    Sentry.captureException(err);
  }
  next(err);
};

/**
 * Sentry request handler (must be first middleware)
 */
export const sentryRequestHandler = Sentry.Handlers.requestHandler();

/**
 * Sentry tracing handler
 */
export const sentryTracingHandler = Sentry.Handlers.tracingHandler();

