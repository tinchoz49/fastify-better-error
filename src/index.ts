import type { FastifyPluginAsync } from 'fastify'
import type { FastifySchemaValidationError, SchemaErrorDataVar } from 'fastify/types/schema.js'

import createErrorBase, { type FastifyErrorConstructor } from '@fastify/error'
import { type Static, type TSchema, Type } from '@sinclair/typebox'
import fastifyPlugin from 'fastify-plugin'

const ValidationItemSchema = Type.Object({
  instancePath: Type.String({ example: '' }),
  schemaPath: Type.String({ example: 'Schema/type' }),
  keyword: Type.String({ example: 'type' }),
  params: Type.Record(Type.String(), Type.Unknown()),
  message: Type.String({ example: 'must be object' }),
})

const HttpErrorSchema = Type.Object({
  statusCode: Type.Number({
    description: 'HTTP Status Code',
    example: 404,
  }),
  code: Type.String({
    description: 'Application Status Code',
    example: 'ERR_NOT_FOUND',
  }),
  message: Type.String({
    description: 'Application Error Message',
    example: 'Not Found',
  }),
}, {
  $id: 'HttpError',
  title: 'HTTP Error',
  description: 'HTTP Error',
})

const BadRequestErrorSchema = Type.Object({
  statusCode: Type.Number({
    description: 'HTTP Status Code',
    example: 400,
  }),
  code: Type.String({
    description: 'Application Status Code',
    example: 'FST_ERR_VALIDATION',
  }),
  message: Type.String({
    description: 'Application Error Message',
    example: 'A validation error occurred',
  }),
  validation: Type.Optional(
    Type.Array(ValidationItemSchema, {
      description: 'Validation Errors',
    })
  ),
  validationContext: Type.Optional(Type.String({
    description: 'Validation Context',
    example: 'body',
  })),
}, {
  $id: 'BadRequestError',
  title: 'Bad Request Error',
  description: 'Bad Request Error',
})

type ValidationItem = Static<typeof ValidationItemSchema>

interface AppError extends FastifyErrorConstructor {
  statusCode: number
  code: string
  message: string
  description?: string
  example?: {
    message?: string
    validation?: ValidationItem[]
  }
}

class ValidationError extends createError(400, 'FST_ERR_VALIDATION', '%s', {
  description: 'A validation error occurred in the request parameters, query, or body',
  example: {
    message: 'params/id must match format "uuid"',
    validation: [{
      instancePath: '/id',
      schemaPath: '#/properties/id/format',
      keyword: 'format',
      params: {
        format: 'uuid',
      },
      message: 'must match format "uuid"',
    }],
    validationContext: 'params',
  },
}) {
  static fromSchemaValidator(validation: FastifySchemaValidationError | FastifySchemaValidationError[], validationContext?: SchemaErrorDataVar | undefined) {
    const errors = Array.isArray(validation) ? validation : [validation]
    const firstError = errors[0]
    const error = validationContext ? new ValidationError(`${validationContext}${firstError.instancePath} ${firstError.message}`) : new ValidationError(`${firstError.instancePath} ${firstError.message}`)
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
}

interface UseErrorItem {
  statusCode: number
  code: string
  message: string
  description?: string
  example?: {
    message?: string
    validation?: ValidationItem[]
  }
}

const httpErrors = {
  BadRequestError: createError(400, 'ERR_BAD_REQUEST', 'Bad Request'),
  UnauthorizedError: createError(401, 'ERR_UNAUTHORIZED', 'Unauthorized'),
  PaymentRequiredError: createError(402, 'ERR_PAYMENT_REQUIRED', 'Payment Required'),
  ForbiddenError: createError(403, 'ERR_FORBIDDEN', 'Forbidden'),
  NotFoundError: createError(404, 'ERR_NOT_FOUND', 'Not Found'),
  MethodNotAllowedError: createError(405, 'ERR_METHOD_NOT_ALLOWED', 'Method Not Allowed'),
  ProxyAuthenticationRequiredError: createError(407, 'ERR_PROXY_AUTHENTICATION_REQUIRED', 'Proxy Authentication Required'),
  RequestTimeoutError: createError(408, 'ERR_REQUEST_TIMEOUT', 'Request Timeout'),
  ConflictError: createError(409, 'ERR_CONFLICT', 'Conflict'),
  GoneError: createError(410, 'ERR_GONE', 'Gone'),
  LengthRequiredError: createError(411, 'ERR_LENGTH_REQUIRED', 'Length Required'),
  PreconditionFailedError: createError(412, 'ERR_PRECONDITION_FAILED', 'Precondition Failed'),
  UriTooLongError: createError(414, 'ERR_URI_TOO_LONG', 'URI Too Long'),
  UnsupportedMediaTypeError: createError(415, 'ERR_UNSUPPORTED_MEDIA_TYPE', 'Unsupported Media Type'),
  RangeNotSatisfiableError: createError(416, 'ERR_RANGE_NOT_SATISFIABLE', 'Range Not Satisfiable'),
  ExpectationFailedError: createError(417, 'ERR_EXPECTATION_FAILED', 'Expectation Failed'),
  ImATeapotError: createError(418, 'ERR_IM_A_TEAPOT', "I'm a teapot"),
  MisdirectedRequestError: createError(421, 'ERR_MISDIRECTED_REQUEST', 'Misdirected Request'),
  UnprocessableEntityError: createError(422, 'ERR_UNPROCESSABLE_ENTITY', 'Unprocessable Entity'),
  LockedError: createError(423, 'ERR_LOCKED', 'Locked'),
  FailedDependencyError: createError(424, 'ERR_FAILED_DEPENDENCY', 'Failed Dependency'),
  TooEarlyError: createError(425, 'ERR_TOO_EARLY', 'Too Early'),
  UpgradeRequiredError: createError(426, 'ERR_UPGRADE_REQUIRED', 'Upgrade Required'),
  PreconditionRequiredError: createError(428, 'ERR_PRECONDITION_REQUIRED', 'Precondition Required'),
  TooManyRequestsError: createError(429, 'ERR_TOO_MANY_REQUESTS', 'Too Many Requests'),
  RequestHeaderFieldsTooLargeError: createError(431, 'ERR_REQUEST_HEADER_FIELDS_TOO_LARGE', 'Request Header Fields Too Large'),
  UnavailableForLegalReasonsError: createError(451, 'ERR_UNAVAILABLE_FOR_LEGAL_REASONS', 'Unavailable For Legal Reasons'),
  InternalServerError: createError(500, 'ERR_INTERNAL_SERVER_ERROR', 'Internal Server Error'),
  NotImplementedError: createError(501, 'ERR_NOT_IMPLEMENTED', 'Not Implemented'),
  BadGatewayError: createError(502, 'ERR_BAD_GATEWAY', 'Bad Gateway'),
  ServiceUnavailableError: createError(503, 'ERR_SERVICE_UNAVAILABLE', 'Service Unavailable'),
  GatewayTimeoutError: createError(504, 'ERR_GATEWAY_TIMEOUT', 'Gateway Timeout'),
  HttpVersionNotSupportedError: createError(505, 'ERR_HTTP_VERSION_NOT_SUPPORTED', 'HTTP Version Not Supported'),
  VariantAlsoNegotiatesError: createError(506, 'ERR_VARIANT_ALSO_NEGOTIATES', 'Variant Also Negotiates'),
  InsufficientStorageError: createError(507, 'ERR_INSUFFICIENT_STORAGE', 'Insufficient Storage'),
  LoopDetectedError: createError(508, 'ERR_LOOP_DETECTED', 'Loop Detected'),
  BandwidthLimitExceededError: createError(509, 'ERR_BANDWIDTH_LIMIT_EXCEEDED', 'Bandwidth Limit Exceeded'),
  NotExtendedError: createError(510, 'ERR_NOT_EXTENDED', 'Not Extended'),
  NetworkAuthenticationRequiredError: createError(511, 'ERR_NETWORK_AUTHENTICATION_REQUIRED', 'Network Authentication Required'),
} as const

const defaultErrors = {
  ...httpErrors,
  ValidationError,
}

type ErrorKeys<T extends Record<string, AppError> = {}> = keyof (typeof defaultErrors & T)

const httpErrorsByStatusCode = Object.fromEntries(Object.entries(httpErrors).map(([code, error]) => [error.statusCode, error]))

export function createError(statusCode: number, code: string, message: string, options?: {
  description?: string
  example?: {
    message?: string
    validation?: ValidationItem[]
    validationContext?: string
  }
}): AppError {
  const error = createErrorBase(code, message, statusCode) as AppError
  error.statusCode = statusCode
  error.code = code
  error.message = message
  error.description = options?.description
  error.example = options?.example
  return error
}

export interface BetterErrorOptions {
  errors?: Record<string, AppError>
}

const betterError: FastifyPluginAsync<BetterErrorOptions> = async (app, options) => {
  const { errors: userErrors = {} } = options

  const allErrors = {
    ...defaultErrors,
    ...userErrors,
  }

  type AllErrors = typeof allErrors

  app.setErrorHandler(function (error, request, reply) {
    if (error.validation) {
      return reply.status(400).send({
        statusCode: 400,
        code: error.code,
        message: error.message,
        validation: error.validation,
        validationContext: error.validationContext,
      })
    }

    const statusCode = error.statusCode ?? 500
    reply.status(statusCode).send({
      statusCode,
      code: error.code ?? httpErrorsByStatusCode[statusCode].code,
      message: error.message,
    })
  })

  app.addSchema(HttpErrorSchema)
  app.addSchema(BadRequestErrorSchema)
  app.decorate('errors', allErrors)
  app.decorate('createError', createError)
  app.decorate('useErrors', (errors: Array<keyof AllErrors | AppError>) => {
    const codes = new Map<number, UseErrorItem[]>()
    const schemas: Record<number, TSchema> = {}

    errors.forEach((errorKey) => {
      let item: UseErrorItem
      if (typeof errorKey === 'string') {
        const error = allErrors[errorKey as keyof AllErrors]

        item = {
          statusCode: error.statusCode,
          code: error.code,
          message: error.message,
          example: error.example,
        }
      } else {
        item = {
          statusCode: errorKey.statusCode,
          code: errorKey.code,
          message: errorKey.message,
          description: errorKey.description,
          example: errorKey.example,
        }
      }

      if (codes.has(item.statusCode)) {
        codes.get(item.statusCode)?.push(item)
      } else {
        codes.set(item.statusCode, [item])
      }
    })

    codes.forEach((items, statusCode) => {
      const schema = statusCode === 400 ? BadRequestErrorSchema : HttpErrorSchema
      schemas[statusCode] = Type.Ref(schema.$id as string, {
        'x-examples': Object.fromEntries(items.map(item => [item.code, {
          summary: item.code,
          description: item.description,
          value: {
            statusCode: item.statusCode,
            code: item.code,
            message: item.message,
            ...(item.example || {}),
          },
        }])),
        'description': httpErrorsByStatusCode[statusCode].message as string,
      })
    })

    return schemas
  })
}

export default fastifyPlugin(betterError, {
  name: 'better-error',
})

export interface BetterErrorPlugin<T extends Record<string, AppError> = {}> {
  errors: typeof defaultErrors & T
  useErrors: (errors: Array<ErrorKeys<T> | AppError>) => Record<number, TSchema>
  createError: typeof createError
}
