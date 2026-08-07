import httpx                                                             #Clerk’s backend SDK requires an httpx.Request, while FastAPI provides a Request, so the request must be converted.
from fastapi import Depends, HTTPException, Request, status
from clerk_backend_api.security import AuthenticateRequestOptions
from app.core.config import settings
from app.core.clerk import clerk

class AuthUser:
    def __init__(self, user_id: str, org_id: str, org_permissions: list):            # To create object from whatever information clerk has return
        self.user_id = user_id
        self.org_id = org_id
        self.org_permissions = org_permissions

    def has_permission(self, permision: str) -> bool:                                # helper function to return whether user has particular permission or not after checking from self.org_permissions (object declared above)
        return permision in self.org_permissions
    
    @property                                                                        # @property lets you access a method as if it were a normal attribute.
    def can_view(self) -> bool:                                                      # This function is calling the above function ---> has_permission()
        return self.has_permission("org:tasks:view")
    
    @property 
    def can_create(self) -> bool:
        return self.has_permission("org:tasks:create")
    
    @property 
    def can_delete(self) -> bool:
        return self.has_permission("org:tasks:delete")
    
    @property 
    def can_edit(self) -> bool:
        return self.has_permission("org:tasks:edit")
    

def convert_to_httpx_request(fastapi_request: Request) -> httpx.Request:        #fastapi request object is converted to httpx request object to use it directly with clerk model 
        return httpx.Request(
            method = fastapi_request.method,                                    # method i.e. put, patch, delete, get, post
            url = str(fastapi_request.url),                                     # makes url ---> http://localhost:8000/api/tasks
            headers = dict(fastapi_request.headers)                             # whatever headers it has like for authorization 
        )

async def get_current_user(request: Request) -> AuthUser:
    httpx_request = convert_to_httpx_request(request)                           # calling above method to convert request into httpx request

    request_state = clerk.authenticate_request(                                 # sending data to clerk to verify JWT
          httpx_request,
          AuthenticateRequestOptions(authorized_parties=[settings.FRONTEND_URL])    #Accept the tokens coming only from frontend url of this project only
     )

    if not request_state.is_signed_in:
          raise HTTPException(
               status_code = status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
          )
    

    claims = request_state.payload                                                    # Information inside JWT is called claims
    user_id = claims.get("sub")
    org_id = claims.get("org_id")
    org_permissions = claims.get("permissions") or claims.get("org_permissions") or []


    if not user_id:
        raise HTTPException(
                status_code = status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
            )

    if not org_id:
        raise HTTPException(
                status_code = status.HTTP_400_BAD_REQUEST, detail="No organization selected"
            )

    return AuthUser(user_id=user_id, org_id=org_id, org_permissions=org_permissions)



def require_view(user: AuthUser = Depends(get_current_user)) -> AuthUser:
     if not user.can_view:
          raise HTTPException(
               status_code = status.HTTP_403_FORBIDDEN,
               detail = "view permisiion required"
          )
     return user



def require_create(user: AuthUser = Depends(get_current_user)) -> AuthUser:
     if not user.can_create:
          raise HTTPException(
               status_code = status.HTTP_403_FORBIDDEN,
               detail = "create permisiion required"
          )
     return user


def require_delete(user: AuthUser = Depends(get_current_user)) -> AuthUser:
     if not user.can_delete:
          raise HTTPException(
               status_code = status.HTTP_403_FORBIDDEN,
               detail = "delete permisiion required"
          )
     return user


def require_edit(user: AuthUser = Depends(get_current_user)) -> AuthUser:
     if not user.can_edit:
          raise HTTPException(
               status_code = status.HTTP_403_FORBIDDEN,
               detail = "edit permisiion required"
          )
     return user

