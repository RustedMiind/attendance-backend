function successResponse<T>(
  data: T,
  message: string = "Response is ready",
  status: string = "success"
): ResponseType<T> {
  return response<T>(data, message, status);
}
function errorResponse<T>(
  data: T,
  message: string = "Error occured",
  status: string = "failed"
): ResponseType<T> {
  return response<T>(data, message, status);
}

function response<T>(
  data: T,
  message: string,
  status: string
): ResponseType<T> {
  return {
    data,
    message,
    status,
  };
}

interface ResponseType<T> {
  data: T;
  message: string;
  status: string;
}
export { successResponse, errorResponse };
