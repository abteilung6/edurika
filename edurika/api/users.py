from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from edurika import models, schemas
from edurika.api.deps import get_current_user, get_db, get_jwt_manager
from edurika.crud.users import user_create, user_get, user_get_by_username_or_email
from edurika.utils.password_hashing import hash_password, verify_password
from edurika.utils.jwt import JwtManager, JwtPayload

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=schemas.SignUpResponse)
def users_register(
    sign_up_request: schemas.SignUpRequest,
    db: Session = Depends(get_db),
    jwt_manager: JwtManager = Depends(get_jwt_manager),
) -> schemas.SignUpResponse:
    if user_get_by_username_or_email(db, username=sign_up_request.username, email=sign_up_request.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username or email already exists",
        )
    hashed_password = hash_password(sign_up_request.password)
    user_model = user_create(
        db,
        obj_in=schemas.UserCreate(
            email=sign_up_request.email,
            hashed_password=hashed_password,
            public_name=sign_up_request.public_name,
            username=sign_up_request.username,
            subtitle=sign_up_request.subtitle,
            description=sign_up_request.description,
        ),
    )
    access_token = jwt_manager.create_access_token(payload=JwtPayload(sub=str(user_model.username)))
    return schemas.SignUpResponse(user=user_model, access_token=access_token, token_type="bearer")  # type: ignore[arg-type]


@router.post("/login", response_model=schemas.SignInResponse)
def users_login(
    sign_in_request: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
    jwt_manager: JwtManager = Depends(get_jwt_manager),
) -> schemas.SignInResponse:
    if (user := user_get(db, username=sign_in_request.username)) is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(sign_in_request.password, str(user.hashed_password)):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = jwt_manager.create_access_token(payload=JwtPayload(sub=str(user.username)))
    return schemas.SignInResponse(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=schemas.User)
def users_me(current_user: models.User = Depends(get_current_user)) -> schemas.User:
    return current_user  # type: ignore
