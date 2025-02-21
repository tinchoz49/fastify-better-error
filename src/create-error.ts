import type { FastifySchemaValidationError, SchemaErrorDataVar } from 'fastify/types/schema.js'

import format from 'quick-format-unescaped'

import type { ValidationItem } from './schemas.js'

export class FastifyBetterError extends Error {
  static statusCode: number
  static code: string
  static message: string
  static description?: string
  static example?: {
    message?: string
    validation?: ValidationItem[]
    validationContext?: string
  }

  statusCode: number
  code: string
  message: string
  validation?: ValidationItem[]
  validationContext?: string

  static equals(err: any) {
    return err && typeof err === 'object' && err.code && err.code === this.code
  }

  static fromSchemaValidator(validation: FastifySchemaValidationError | FastifySchemaValidationError[], validationContext?: SchemaErrorDataVar | undefined) {
    const errors = Array.isArray(validation) ? validation : [validation]
    const firstError = errors[0]
    const StaticClass = this as typeof FastifyBetterError
    const error = validationContext ? new StaticClass(`${validationContext}${firstError.instancePath} ${firstError.message}`) : new StaticClass(`${firstError.instancePath} ${firstError.message}`)
    error.validation = errors.map(error => ({
      instancePath: error.instancePath,
      schemaPath: error.schemaPath,
      keyword: error.keyword,
      params: error.params,
      message: error.message ?? '',
    }))
    error.validationContext = validationContext
    return error
  }

  static fromError(err: Error) {
    const newErr = new this(err.message)
    newErr.cause = err
    return newErr
  }

  constructor(...args: any[]) {
    super()

    const StaticClass = this.constructor as typeof FastifyBetterError

    this.statusCode = StaticClass.statusCode
    this.code = StaticClass.code
    this.message = format(StaticClass.message, args)
    Error.stackTraceLimit !== 0 && Error.captureStackTrace(this, StaticClass)
  }
}

interface CreateErrorOptions {
  statusCode: number
  code: string
  message: string
  description?: string
  example?: {
    message?: string
    validation?: ValidationItem[]
    validationContext?: string
  }
}

export function createError({ statusCode, code, message, description, example }: CreateErrorOptions) {
  return class extends FastifyBetterError {
    static statusCode = statusCode
    static code = code
    static message = message
    static description = description
    static example = example

    static from(err: FastifyBetterError | Error) {
      const newErr = new this(`[${err.toString()}]`)
      newErr.stack = err.stack || newErr.stack
      return newErr
    }
  }
}
