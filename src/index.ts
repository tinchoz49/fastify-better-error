import type { FastifyPluginAsync } from 'fastify'
import type { TSchema } from 'typebox'

import fastifyPlugin from 'fastify-plugin'
import { Type } from 'typebox'

import { createError, FastifyBetterError } from './create-error.js'
import * as httpErrors from './https-errors.js'
import { BadRequestErrorSchema, HttpErrorSchema, type ValidationItem } from './schemas.js'

export { createError, FastifyBetterError }

export class ValidationError extends FastifyBetterError {
  static statusCode = 400
  static code = 'FST_ERR_VALIDATION'
  static description = 'A validation error occurred in the request parameters, query, or body'
  static example = {
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

const defaultErrors = {
  ...httpErrors,
  ValidationError,
}

type ErrorKeys<T extends Record<string, FastifyBetterError> = {}> = keyof (typeof defaultErrors & T)

const httpErrorsByStatusCode = Object.fromEntries(Object.entries(httpErrors).map(([_, error]) => [error.statusCode, error]))

export interface BetterErrorOptions<T extends Record<string, FastifyBetterError> = {}> {
  errors?: T
}

const betterError: FastifyPluginAsync<BetterErrorOptions> = async (app, options) => {
  const { errors: userErrors = {} } = options

  const allErrors = {
    ...defaultErrors,
    ...userErrors,
  }

  type AllErrors = typeof allErrors

  app.setErrorHandler(function (error, request, reply) {
    app.log.error(error)

    if (error.validation) {
      return reply.status(400)
        .header('connection', 'close')
        .send({
          statusCode: 400,
          code: error.code,
          message: error.message,
          validation: error.validation,
          validationContext: error.validationContext,
        })
    }

    const statusCode = error.statusCode ?? 500
    reply.status(statusCode)
      .header('connection', 'close')
      .send({
        statusCode,
        code: error.code ?? httpErrorsByStatusCode[statusCode].code,
        message: error.message,
      })
  })

  app.addSchema(HttpErrorSchema)
  app.addSchema(BadRequestErrorSchema)
  app.decorate('errors', allErrors)
  app.decorate('useErrors', (errors: Array<keyof AllErrors | FastifyBetterError>) => {
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
          description: error.description,
        }
      } else {
        const error = errorKey as unknown as AllErrors[keyof AllErrors]
        item = {
          statusCode: error.statusCode,
          code: error.code,
          message: error.message,
          description: error.description,
          example: error.example,
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
      schemas[statusCode] = Type.Ref((schema as any).$id as string, {
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

export interface BetterErrorPlugin<T extends Record<string, FastifyBetterError> = {}> {
  errors: typeof defaultErrors & T
  useErrors: (errors: Array<ErrorKeys<T> | FastifyBetterError>) => Record<number, TSchema>
}
