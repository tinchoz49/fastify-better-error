# fastify-better-error

> Supercharge Fastify error handling! Streamline definitions, automate schemas, and boost productivity with built-in HTTP errors and robust TypeScript support. Make errors work for you!

![Tests](https://github.com/tinchoz49/fastify-better-error/actions/workflows/test.yml/badge.svg)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard--ext-05ae89.svg)](https://github.com/tinchoz49/eslint-config-standard-ext)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat)](https://github.com/RichardLitt/standard-readme)

## Background

This plugin simplifies how to define and use errors in Fastify. It provides a way to create custom errors with specific status codes and messages, and to automatically generate response schemas for these errors.

Additionally, it includes a comprehensive set of predefined HTTP errors and provides robust TypeScript support with enhanced IntelliSense capabilities. This combination allows for more efficient error handling and improved developer experience through better code completion and type checking.

## Install

```bash
$ npm install fastify-better-error
```

## Usage

Using JavaScript with JSDoc:

```js
/**
 * @import { BetterErrorPlugin } from 'fastify-better-error'
 */

import fastify from 'fastify'
import betterErrorPlugin, { createError } from 'fastify-better-error'

const CUSTOM_ERRORS = {
  WrongCredentialsError: createError(401, 'WRONG_CREDENTIALS', 'Wrong credentials: %s'),
}

const baseApp = fastify()

// By doing this, we are telling TypeScript that `app` has all the properties of `baseApp` plus the ones defined in `BetterErrorPlugin`.
const app = /** @type {typeof baseApp & BetterErrorPlugin<typeof CUSTOM_ERRORS>} */(baseApp)

await app.register(betterErrorPlugin, {
  errors: CUSTOM_ERRORS,
})

app.get('/', {
  schema: {
    response: {
      // it will automatically generate the 401 and 404 status code for this error
      ...app.useErrors([
        'WrongCredentialsError',
        'NotFoundError',
      ]),
    },
  },
}, (req) => {
  if (!(req.token)) {
    throw new app.errors.WrongCredentialsError('missing token')
  }

  if (!(req.user)) {
    throw new app.errors.NotFoundError('user not found')
  }

  return {}
})
```

Using TypeScript:

```ts
import fastify from 'fastify'
import betterErrorPlugin, { type BetterErrorPlugin, createError } from 'fastify-better-error'

const CUSTOM_ERRORS = {
  WrongCredentialsError: createError(401, 'WRONG_CREDENTIALS', 'Wrong credentials: %s'),
}

const baseApp = fastify()

const app = baseApp as typeof baseApp & BetterErrorPlugin<typeof CUSTOM_ERRORS>

await app.register(betterErrorPlugin, {
  errors: CUSTOM_ERRORS,
})

app.get('/', {
  schema: {
    response: {
      // it will automatically generate the 401 and 404 status code for this error
      ...app.useErrors([
        'WrongCredentialsError',
        'NotFoundError',
      ]),
    },
  },
}, (req) => {
  if (!(req.token)) {
    throw new app.errors.WrongCredentialsError('missing token')
  }

  if (!(req.user)) {
    throw new app.errors.NotFoundError('user not found')
  }

  return {}
})
```

### HTTP Errors

The plugin also includes the default HTTP errors:

- BadRequestError (400)
  - Message: "Bad Request"
  - Code: "ERR_BAD_REQUEST"
- UnauthorizedError (401)
  - Message: "Unauthorized"
  - Code: "ERR_UNAUTHORIZED"
- PaymentRequiredError (402)
  - Message: "Payment Required"
  - Code: "ERR_PAYMENT_REQUIRED"
- ForbiddenError (403)
  - Message: "Forbidden"
  - Code: "ERR_FORBIDDEN"
- NotFoundError (404)
  - Message: "Not Found"
  - Code: "ERR_NOT_FOUND"
- MethodNotAllowedError (405)
  - Message: "Method Not Allowed"
  - Code: "ERR_METHOD_NOT_ALLOWED"
- NotAcceptableError (406)
  - Message: "Not Acceptable"
  - Code: "ERR_NOT_ACCEPTABLE"
- ProxyAuthenticationRequiredError (407)
  - Message: "Proxy Authentication Required"
  - Code: "ERR_PROXY_AUTHENTICATION_REQUIRED"
- RequestTimeoutError (408)
  - Message: "Request Timeout"
  - Code: "ERR_REQUEST_TIMEOUT"
- ConflictError (409)
  - Message: "Conflict"
  - Code: "ERR_CONFLICT"
- GoneError (410)
  - Message: "Gone"
  - Code: "ERR_GONE"
- LengthRequiredError (411)
  - Message: "Length Required"
  - Code: "ERR_LENGTH_REQUIRED"
- PreconditionFailedError (412)
  - Message: "Precondition Failed"
  - Code: "ERR_PRECONDITION_FAILED"
- UriTooLongError (414)
  - Message: "URI Too Long"
  - Code: "ERR_URI_TOO_LONG"
- UnsupportedMediaTypeError (415)
  - Message: "Unsupported Media Type"
  - Code: "ERR_UNSUPPORTED_MEDIA_TYPE"
- RangeNotSatisfiableError (416)
  - Message: "Range Not Satisfiable"
  - Code: "ERR_RANGE_NOT_SATISFIABLE"
- ExpectationFailedError (417)
  - Message: "Expectation Failed"
  - Code: "ERR_EXPECTATION_FAILED"
- ImATeapotError (418)
  - Message: "I'm a teapot"
  - Code: "ERR_IM_A_TEAPOT"
- MisdirectedRequestError (421)
  - Message: "Misdirected Request"
  - Code: "ERR_MISDIRECTED_REQUEST"
- UnprocessableEntityError (422)
  - Message: "Unprocessable Entity"
  - Code: "ERR_UNPROCESSABLE_ENTITY"
- LockedError (423)
  - Message: "Locked"
  - Code: "ERR_LOCKED"
- FailedDependencyError (424)
  - Message: "Failed Dependency"
  - Code: "ERR_FAILED_DEPENDENCY"
- TooEarlyError (425)
  - Message: "Too Early"
  - Code: "ERR_TOO_EARLY"
- UpgradeRequiredError (426)
  - Message: "Upgrade Required"
  - Code: "ERR_UPGRADE_REQUIRED"
- PreconditionRequiredError (428)
  - Message: "Precondition Required"
  - Code: "ERR_PRECONDITION_REQUIRED"
- TooManyRequestsError (429)
  - Message: "Too Many Requests"
  - Code: "ERR_TOO_MANY_REQUESTS"
- RequestHeaderFieldsTooLargeError (431)
  - Message: "Request Header Fields Too Large"
  - Code: "ERR_REQUEST_HEADER_FIELDS_TOO_LARGE"
- UnavailableForLegalReasonsError (451)
  - Message: "Unavailable For Legal Reasons"
  - Code: "ERR_UNAVAILABLE_FOR_LEGAL_REASONS"
- InternalServerError (500)
  - Message: "Internal Server Error"
  - Code: "ERR_INTERNAL_SERVER_ERROR"
- NotImplementedError (501)
  - Message: "Not Implemented"
  - Code: "ERR_NOT_IMPLEMENTED"
- BadGatewayError (502)
  - Message: "Bad Gateway"
  - Code: "ERR_BAD_GATEWAY"
- ServiceUnavailableError (503)
  - Message: "Service Unavailable"
  - Code: "ERR_SERVICE_UNAVAILABLE"
- GatewayTimeoutError (504)
  - Message: "Gateway Timeout"
  - Code: "ERR_GATEWAY_TIMEOUT"
- HttpVersionNotSupportedError (505)
  - Message: "HTTP Version Not Supported"
  - Code: "ERR_HTTP_VERSION_NOT_SUPPORTED"
- VariantAlsoNegotiatesError (506)
  - Message: "Variant Also Negotiates"
  - Code: "ERR_VARIANT_ALSO_NEGOTIATES"
- InsufficientStorageError (507)
  - Message: "Insufficient Storage"
  - Code: "ERR_INSUFFICIENT_STORAGE"
- LoopDetectedError (508)
  - Message: "Loop Detected"
  - Code: "ERR_LOOP_DETECTED"
- BandwidthLimitExceededError (509)
  - Message: "Bandwidth Limit Exceeded"
  - Code: "ERR_BANDWIDTH_LIMIT_EXCEEDED"
- NotExtendedError (510)
  - Message: "Not Extended"
  - Code: "ERR_NOT_EXTENDED"
- NetworkAuthenticationRequiredError (511)
  - Message: "Network Authentication Required"
  - Code: "ERR_NETWORK_AUTHENTICATION_REQUIRED"

## Issues

:bug: If you found an issue we encourage you to report it on [github](https://github.com/tinchoz49/fastify-better-error/issues). Please specify your OS and the actions to reproduce it.

## Contributing

:busts_in_silhouette: Ideas and contributions to the project are welcome. You must follow this [guideline](https://github.com/tinchoz49/fastify-better-error/blob/main/CONTRIBUTING.md).

## License

MIT © 2024 Martin Acosta
