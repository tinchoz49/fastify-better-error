import assert from 'node:assert'
import { describe, it } from 'node:test'

import { expectTypeOf } from 'expect-type'
import fastify from 'fastify'
import betterErrorPlugin, { type BetterErrorPlugin, createError } from 'src/index.js'

const CUSTOM_ERRORS = {
  CustomError: createError({
    statusCode: 400,
    code: 'ERR_CUSTOM',
    message: 'Custom error',
  }),
}

async function createApp() {
  const app = fastify()

  await app.register(betterErrorPlugin, { errors: CUSTOM_ERRORS })

  const extendedApp = app as typeof app & BetterErrorPlugin<typeof CUSTOM_ERRORS>

  expectTypeOf(extendedApp).toHaveProperty('errors')
  expectTypeOf(extendedApp).toHaveProperty('useErrors')
  expectTypeOf(extendedApp.useErrors).toBeCallableWith(['NotFoundError'])
  expectTypeOf(extendedApp.useErrors).toBeCallableWith(['CustomError'])

  return app
}

type App = Awaited<ReturnType<typeof createApp>> & BetterErrorPlugin<typeof CUSTOM_ERRORS>

describe('fastify-better-error', () => {
  it('should return an error', async () => {
    const app = await createApp() as App

    app.get('/', () => {
      throw app.errors.BadRequestError
    })

    const response = await app.inject({
      method: 'GET',
      url: '/',
    })

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.json().code, 'ERR_BAD_REQUEST')
  })

  it('should return an error with schema serialization', async () => {
    const app = await createApp() as App

    app.get('/', {
      schema: {
        response: {
          ...app.useErrors(['BadRequestError']),
        },
      },
    }, () => {
      throw app.errors.BadRequestError
    })

    const response = await app.inject({
      method: 'GET',
      url: '/',
    })

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.json().code, 'ERR_BAD_REQUEST')
  })

  it('should return an error with schema serialization and custom error', async () => {
    const app = await createApp() as App

    app.get('/', {
      schema: {
        response: {
          ...app.useErrors(['CustomError']),
        },
      },
    }, () => {
      throw app.errors.CustomError
    })

    const response = await app.inject({
      method: 'GET',
      url: '/',
    })

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.json().code, 'ERR_CUSTOM')
  })

  it('should return a validation error with schema serialization', async () => {
    const app = await createApp() as App

    app.get('/:id', {
      schema: {
        params: {
          type: 'object',
          properties: {
            id: { type: 'number' },
          },
        },
        response: {
          ...app.useErrors(['ValidationError']),
        },
      },
    }, () => {
      return null
    })

    const response = await app.inject({
      method: 'GET',
      url: '/test',
    })

    assert.strictEqual(response.statusCode, 400)
    assert.strictEqual(response.json().code, 'FST_ERR_VALIDATION')
    assert.deepStrictEqual(response.json().validation, [{
      instancePath: '/id',
      schemaPath: '#/properties/id/type',
      keyword: 'type',
      params: { type: 'number' },
      message: 'must be number',
    }])
  })
})
