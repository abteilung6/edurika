class ShopifyApiError(Exception):
    """Base exception for API request errors"""

    def __init__(self, status_code: int, message: str | None = None) -> None:
        self.status_code = status_code
        self.message = message or self.default_message()
        super().__init__(f"{status_code}: {self.message}")

    def default_message(self) -> str:
        """Returns the default message based on the status code"""
        return "An error occurred while making an API request."


class TooManyRequestsError(ShopifyApiError):
    """Exception raised for HTTP 429 Too Many Requests"""

    def __init__(self, message: str | None = None) -> None:
        default_msg = "Too many requests. Please slow down."
        super().__init__(429, message or default_msg)


class ServerError(ShopifyApiError):
    """Exception raised for HTTP 500+ errors"""

    def __init__(self, status_code: int, message: str | None = None) -> None:
        default_msg = f"Server error {status_code}. Try again later."
        super().__init__(status_code, message or default_msg)
