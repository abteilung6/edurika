import os
from collections.abc import Generator
from typing import Any

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from edurika import models
from edurika.api.deps import get_db, get_jwt_manager
from edurika.app import get_application
from edurika.models.base import Base as DBBase
from edurika.utils.password_hashing import pwd_context
from edurika.utils.jwt import JwtManager, JwtPayload

SQLALCHEMY_DATABASE_URL = os.getenv("TEST_DATABASE_URL", "sqlite:///test-dummy.db")

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
test_session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
fake_jwt_manager = JwtManager(secret_key="test_secret_key", algorithm="HS256")


@pytest.fixture(name="app")
def fixture_app() -> Generator[FastAPI, Any, None]:
    DBBase.metadata.create_all(engine)
    _app = get_application()
    yield _app
    DBBase.metadata.drop_all(engine)


@pytest.fixture(name="db_session")
def fixture_db_session(app: FastAPI) -> Generator[Session, Any, None]:
    connection = engine.connect()
    transaction = connection.begin()
    session = test_session(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(name="jwt_manager")
def fixture_jwt_manager() -> JwtManager:
    return fake_jwt_manager


@pytest.fixture(name="client")
def fixture_client(app: FastAPI, db_session: Session, jwt_manager: JwtManager) -> Generator[TestClient, Any, None]:
    def _get_test_db() -> Generator[Session, Any, None]:
        try:
            yield db_session
        finally:
            pass

    def _get_jwt_manager() -> Generator[JwtManager, Any, None]:
        try:
            yield jwt_manager
        finally:
            pass

    app.dependency_overrides[get_db] = _get_test_db
    app.dependency_overrides[get_jwt_manager] = _get_jwt_manager
    with TestClient(app) as client:
        yield client


@pytest.fixture(name="auth_user")
def test_auth_user(db_session: Session) -> models.User:
    user_data = {
        "email": "testuser@example.com",
        "username": "testuser",
        "hashed_password": pwd_context.hash("password123"),
        "public_name": "Test user",
        "subtitle": "Subtitle",
        "description": "Description",
    }
    user = models.User(**user_data)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture(name="auth_bearer_token")
def test_auth_bearer_token(auth_user: models.User, jwt_manager: JwtManager) -> str:
    return jwt_manager.create_access_token(payload=JwtPayload(sub=str(auth_user.username)))


@pytest.fixture(name="auth_client")
def fixture_auth_client(client: TestClient, auth_bearer_token: str) -> TestClient:
    client.headers.update({"Authorization": f"Bearer {auth_bearer_token}"})
    return client
