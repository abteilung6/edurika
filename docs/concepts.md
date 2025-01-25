# Concepts

## Authentication

The authentication system provides secure user management, including:

- User Registration (Signup)
- User Login (Sign-In)
- JWT-Based Access Tokens
- Protected Endpoints

### JWT Creation

Secret Key
- The SECRET_KEY is used to sign the JWT.
- It must be a strong, randomly generated string stored securely in environment variables.

Algorithm
- The token is signed using the HS256 algorithm (HMAC with SHA-256).
- This algorithm ensures the integrity and authenticity of the token.

Expiration
- The token expiration time is configurable through the ACCESS_TOKEN_EXPIRE_MINUTES setting.

Claims
- sub: Contains the username as the subject claim.
- exp: Specifies the token’s expiration timestamp


### Further improvements

The authentication system needs

- Refresh access tokens
- Authenticator for Google, Microsoft, Facebook
