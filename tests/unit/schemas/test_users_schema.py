from dataclasses import dataclass

import pytest
from pydantic import ValidationError

from edurika.schemas.users import SignUpRequest


@dataclass
class DefaultedSignUpRequest:
    email: str = "username@email.com"
    password: str = "Fake-password123!"
    username: str = "fake-username"
    public_name: str = "fake-public-name"
    subtitle: str = "fake-subtitle"
    description: str = "fake-description"


@pytest.mark.parametrize("password", ["Fake-password123!", "AnotherFakePassword123!"])
def test_default_sign_up_request_password_valid(password: str) -> None:
    default_sign_up_request = DefaultedSignUpRequest(password=password)
    assert SignUpRequest(**default_sign_up_request.__dict__).password == password


@pytest.mark.parametrize("password", ["Sho", "NoNumber!", "nouppercase1!", "NoSpecial1", "weak", ""])
def test_default_sign_up_request_password_invalid(password: str) -> None:
    default_sign_up_request = DefaultedSignUpRequest(password=password)
    with pytest.raises(ValidationError):
        SignUpRequest(**default_sign_up_request.__dict__)
