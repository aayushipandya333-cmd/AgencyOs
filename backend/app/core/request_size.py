# File created to implement "Request Size Limit" which defines the maximum amount of data a client can send to the server in a single HTTP request.


from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


MAX_REQUEST_SIZE = 1 * 1024 * 1024  # 1 MB


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        content_length = request.headers.get("content-length")

        if content_length:

            try:
                request_size = int(content_length)

            except ValueError:
                return JSONResponse(
                    status_code=400,
                    content={
                        "detail": "Invalid Content-Length header"
                    }
                )

            if request_size > MAX_REQUEST_SIZE:
                return JSONResponse(
                    status_code=413,
                    content={
                        "detail": "Request body too large"
                    }
                )

        response = await call_next(request)

        return response