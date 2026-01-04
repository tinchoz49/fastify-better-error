import { type Static, Type } from 'typebox'

export const ValidationItemSchema = Type.Object({
  instancePath: Type.String({ example: '/name' }),
  schemaPath: Type.String({ example: '#/schema/properties/name' }),
  keyword: Type.String({ example: 'string' }),
  params: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
  message: Type.String({ example: 'must be string' }),
})

export const HttpErrorSchema = Type.Object({
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

export const BadRequestErrorSchema = Type.Object({
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

export type ValidationItem = Static<typeof ValidationItemSchema>
