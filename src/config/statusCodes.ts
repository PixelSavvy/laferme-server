export const statusCodes = {
  // 2xx: Success
  OK: 200, // The request has succeeded.
  CREATED: 201, // The request has been fulfilled and resulted in the creation of a resource.
  ACCEPTED: 202, // The request has been accepted for processing, but the processing has not been completed.
  NO_CONTENT: 204, // The server has successfully processed the request, but is not returning any content.

  // 3xx: Redirection
  MOVED_PERMANENTLY: 301, // The resource has been permanently moved to a new URL.
  FOUND: 302, // The resource has been temporarily moved to a different URL.
  SEE_OTHER: 303, // The response to the request can be found under a different URL using the GET method.
  NOT_MODIFIED: 304, // The resource has not been modified since the last request.

  // 4xx: Client Errors
  BAD_REQUEST: 400, // The server could not understand the request due to invalid syntax.
  UNAUTHORIZED: 401, // The request requires authentication, or the provided credentials are incorrect.
  FORBIDDEN: 403, // The client does not have permission to access the requested resource.
  NOT_FOUND: 404, // The server can’t find the requested resource.
  METHOD_NOT_ALLOWED: 405, // The HTTP method is not allowed for the resource.
  CONFLICT: 409, // The request could not be processed because of a conflict (e.g., duplicate entries).
  UNPROCESSABLE_ENTITY: 422, // The server understands the content type and syntax, but the request could not be processed.

  // 5xx: Server Errors
  INTERNAL_SERVER_ERROR: 500, // The server encountered an unexpected condition that prevented it from fulfilling the request.
  NOT_IMPLEMENTED: 501, // The server does not support the functionality required to fulfill the request.
  BAD_GATEWAY: 502, // The server received an invalid response from the upstream server.
  SERVICE_UNAVAILABLE: 503, // The server is currently unable to handle the request due to temporary overload or maintenance.
  GATEWAY_TIMEOUT: 504, // The server, while acting as a gateway, did not receive a timely response from the upstream server.
};
