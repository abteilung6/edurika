from fastapi.testclient import TestClient

from edurika import models
from edurika.utils.jwt import JwtManager


def test_sign_up(client: TestClient, jwt_manager: JwtManager) -> None:
    response = client.post(
        "/users/register",
        json={
            "username": "username",
            "email": "name@localhost.com",
            "password": "Foo1234!",
            "public_name": "public_name",
            "subtitle": "subtitle",
            "description": "description",
        },
    )
    assert response.status_code == 200
    content = response.json()
    assert content["token_type"] == "bearer"
    access_token = content["access_token"]
    assert isinstance(access_token, str)
    assert jwt_manager.decode_access_token(access_token).sub == "username"
    user = content["user"]
    assert isinstance(user, dict)
    assert user["username"] == "username"
    assert user["email"] == "name@localhost.com"
    assert user["public_name"] == "public_name"
    assert user["subtitle"] == "subtitle"
    assert user["description"] == "description"
    assert "password" not in user
    assert "hashed_password" not in user


def test_sign_up_with_existing_user(client: TestClient, auth_user: models.User) -> None:
    response = client.post(
        "/users/register",
        json={
            "username": auth_user.username,
            "email": auth_user.email,
            "password": "Foo1234!",
            "public_name": "public_name",
            "subtitle": "subtitle",
            "description": "description",
        },
    )
    assert response.status_code == 400
    content = response.json()
    assert content == {"detail": "A user with this username or email already exists"}


def test_sign_in(client: TestClient, auth_user: models.User, jwt_manager: JwtManager) -> None:
    response = client.post(
        "/users/login",
        data={"username": auth_user.username, "password": "password123"},
    )
    assert response.status_code == 200
    content = response.json()
    assert content["token_type"] == "bearer"
    access_token = content["access_token"]
    assert isinstance(access_token, str)
    assert jwt_manager.decode_access_token(access_token).sub == auth_user.username


def test_sign_in_with_invalid_credentials(client: TestClient, auth_user: models.User) -> None:
    response = client.post(
        "/users/login",
        data={"username": auth_user.username, "password": "wrong_password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_sign_in_with_nonexistent_user(client: TestClient, auth_user: models.User) -> None:
    response = client.post(
        "/users/login",
        data={"username": "nonexistentuser", "password": "wrong_password"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_user_me(auth_client: TestClient, auth_user: models.User) -> None:
    response = auth_client.get("/users/me")
    assert response.status_code == 200
    content = response.json()
    assert content == {
        "user_id": auth_user.user_id,
        "username": auth_user.username,
        "email": auth_user.email,
        "public_name": auth_user.public_name,
        "subtitle": auth_user.subtitle,
        "description": auth_user.description,
    }


def test_user_me_invalid_token(client: TestClient) -> None:
    response = client.get(
        "/users/me",
        headers={"Authorization": "Bearer eywrongtoken"},
    )
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid token"
