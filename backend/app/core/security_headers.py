# To add security headers in project

from starlette.middleware.base import BaseHTTPMiddleware        # BaseHTTPMiddleware creates a layer that can check/process HTTP requests before they reach the endpoint and responses before they go back to the client.



class SecurityHeadersMiddleware(BaseHTTPMiddleware):              # Creates a custom middleware class for adding security headers.
    async def dispatch(self, request, call_next):                 # Handles each request and controls what happens before/after the endpoint.
        response = await call_next(request)                       # Sends the request to the endpoint and gets its response.

        response.headers["X-Content-Type-Options"] = "nosniff"    # Stops the browser from guessing the file/content type.
        response.headers["X-Frame-Options"] = "DENY"              # Prevents your website from being loaded inside an iframe of any other website.
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"        # Controls how much URL information is shared when leaving your site. "https://agencyos.com/dashboard/client/123" ---> not shared. "https://agencyos.com/" ---> shared
        response.headers["Permissions-Policy"] = (                                     # Blocks the website from using the camera, microphone, and location.
            "camera=(), microphone=(), geolocation=()"
        )

        return response