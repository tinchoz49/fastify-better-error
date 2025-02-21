import { FastifyBetterError } from './create-error.js'

export class BadRequestError extends FastifyBetterError {
  static statusCode = 400
  static code = 'ERR_BAD_REQUEST'
  static message = 'Bad Request'
}

export class UnauthorizedError extends FastifyBetterError {
  static statusCode = 401
  static code = 'ERR_UNAUTHORIZED'
  static message = 'Unauthorized'
}

export class PaymentRequiredError extends FastifyBetterError {
  static statusCode = 402
  static code = 'ERR_PAYMENT_REQUIRED'
  static message = 'Payment Required'
}

export class ForbiddenError extends FastifyBetterError {
  static statusCode = 403
  static code = 'ERR_FORBIDDEN'
  static message = 'Forbidden'
}

export class NotFoundError extends FastifyBetterError {
  static statusCode = 404
  static code = 'ERR_NOT_FOUND'
  static message = 'Not Found'
}

export class MethodNotAllowedError extends FastifyBetterError {
  static statusCode = 405
  static code = 'ERR_METHOD_NOT_ALLOWED'
  static message = 'Method Not Allowed'
}

export class NotAcceptableError extends FastifyBetterError {
  static statusCode = 406
  static code = 'ERR_NOT_ACCEPTABLE'
  static message = 'Not Acceptable'
}

export class ProxyAuthenticationRequiredError extends FastifyBetterError {
  static statusCode = 407
  static code = 'ERR_PROXY_AUTHENTICATION_REQUIRED'
  static message = 'Proxy Authentication Required'
}

export class RequestTimeoutError extends FastifyBetterError {
  static statusCode = 408
  static code = 'ERR_REQUEST_TIMEOUT'
  static message = 'Request Timeout'
}

export class ConflictError extends FastifyBetterError {
  static statusCode = 409
  static code = 'ERR_CONFLICT'
  static message = 'Conflict'
}

export class GoneError extends FastifyBetterError {
  static statusCode = 410
  static code = 'ERR_GONE'
  static message = 'Gone'
}

export class LengthRequiredError extends FastifyBetterError {
  static statusCode = 411
  static code = 'ERR_LENGTH_REQUIRED'
  static message = 'Length Required'
}

export class PreconditionFailedError extends FastifyBetterError {
  static statusCode = 412
  static code = 'ERR_PRECONDITION_FAILED'
  static message = 'Precondition Failed'
}

export class PayloadTooLargeError extends FastifyBetterError {
  static statusCode = 413
  static code = 'ERR_PAYLOAD_TOO_LARGE'
  static message = 'Payload Too Large'
}

export class UriTooLongError extends FastifyBetterError {
  static statusCode = 414
  static code = 'ERR_URI_TOO_LONG'
  static message = 'URI Too Long'
}

export class UnsupportedMediaTypeError extends FastifyBetterError {
  static statusCode = 415
  static code = 'ERR_UNSUPPORTED_MEDIA_TYPE'
  static message = 'Unsupported Media Type'
}

export class RangeNotSatisfiableError extends FastifyBetterError {
  static statusCode = 416
  static code = 'ERR_RANGE_NOT_SATISFIABLE'
  static message = 'Range Not Satisfiable'
}

export class ExpectationFailedError extends FastifyBetterError {
  static statusCode = 417
  static code = 'ERR_EXPECTATION_FAILED'
  static message = 'Expectation Failed'
}

export class ImATeapotError extends FastifyBetterError {
  static statusCode = 418
  static code = 'ERR_IM_A_TEAPOT'
  static message = "I'm a teapot"
}

export class MisdirectedRequestError extends FastifyBetterError {
  static statusCode = 421
  static code = 'ERR_MISDIRECTED_REQUEST'
  static message = 'Misdirected Request'
}

export class UnprocessableEntityError extends FastifyBetterError {
  static statusCode = 422
  static code = 'ERR_UNPROCESSABLE_ENTITY'
  static message = 'Unprocessable Entity'
}

export class LockedError extends FastifyBetterError {
  static statusCode = 423
  static code = 'ERR_LOCKED'
  static message = 'Locked'
}

export class FailedDependencyError extends FastifyBetterError {
  static statusCode = 424
  static code = 'ERR_FAILED_DEPENDENCY'
  static message = 'Failed Dependency'
}

export class TooEarlyError extends FastifyBetterError {
  static statusCode = 425
  static code = 'ERR_TOO_EARLY'
  static message = 'Too Early'
}

export class UpgradeRequiredError extends FastifyBetterError {
  static statusCode = 426
  static code = 'ERR_UPGRADE_REQUIRED'
  static message = 'Upgrade Required'
}

export class PreconditionRequiredError extends FastifyBetterError {
  static statusCode = 428
  static code = 'ERR_PRECONDITION_REQUIRED'
  static message = 'Precondition Required'
}

export class TooManyRequestsError extends FastifyBetterError {
  static statusCode = 429
  static code = 'ERR_TOO_MANY_REQUESTS'
  static message = 'Too Many Requests'
}

export class RequestHeaderFieldsTooLargeError extends FastifyBetterError {
  static statusCode = 431
  static code = 'ERR_REQUEST_HEADER_FIELDS_TOO_LARGE'
  static message = 'Request Header Fields Too Large'
}

export class UnavailableForLegalReasonsError extends FastifyBetterError {
  static statusCode = 451
  static code = 'ERR_UNAVAILABLE_FOR_LEGAL_REASONS'
  static message = 'Unavailable For Legal Reasons'
}

export class InternalServerError extends FastifyBetterError {
  static statusCode = 500
  static code = 'ERR_INTERNAL_SERVER_ERROR'
  static message = 'Internal Server Error'
}

export class NotImplementedError extends FastifyBetterError {
  static statusCode = 501
  static code = 'ERR_NOT_IMPLEMENTED'
  static message = 'Not Implemented'
}

export class BadGatewayError extends FastifyBetterError {
  static statusCode = 502
  static code = 'ERR_BAD_GATEWAY'
  static message = 'Bad Gateway'
}

export class ServiceUnavailableError extends FastifyBetterError {
  static statusCode = 503
  static code = 'ERR_SERVICE_UNAVAILABLE'
  static message = 'Service Unavailable'
}

export class GatewayTimeoutError extends FastifyBetterError {
  static statusCode = 504
  static code = 'ERR_GATEWAY_TIMEOUT'
  static message = 'Gateway Timeout'
}

export class HttpVersionNotSupportedError extends FastifyBetterError {
  static statusCode = 505
  static code = 'ERR_HTTP_VERSION_NOT_SUPPORTED'
  static message = 'HTTP Version Not Supported'
}

export class VariantAlsoNegotiatesError extends FastifyBetterError {
  static statusCode = 506
  static code = 'ERR_VARIANT_ALSO_NEGOTIATES'
  static message = 'Variant Also Negotiates'
}

export class InsufficientStorageError extends FastifyBetterError {
  static statusCode = 507
  static code = 'ERR_INSUFFICIENT_STORAGE'
  static message = 'Insufficient Storage'
}

export class LoopDetectedError extends FastifyBetterError {
  static statusCode = 508
  static code = 'ERR_LOOP_DETECTED'
  static message = 'Loop Detected'
}

export class BandwidthLimitExceededError extends FastifyBetterError {
  static statusCode = 509
  static code = 'ERR_BANDWIDTH_LIMIT_EXCEEDED'
  static message = 'Bandwidth Limit Exceeded'
}

export class NotExtendedError extends FastifyBetterError {
  static statusCode = 510
  static code = 'ERR_NOT_EXTENDED'
  static message = 'Not Extended'
}

export class NetworkAuthenticationRequiredError extends FastifyBetterError {
  static statusCode = 511
  static code = 'ERR_NETWORK_AUTHENTICATION_REQUIRED'
  static message = 'Network Authentication Required'
}
