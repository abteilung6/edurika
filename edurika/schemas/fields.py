from pydantic import Field

UsernameField = Field(..., min_length=4, max_length=50, pattern="^[a-zA-Z0-9_-]+$")
PasswordField = Field(..., min_length=8)
