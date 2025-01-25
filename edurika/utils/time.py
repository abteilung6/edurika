import datetime
from datetime import timezone

SYSTEM_TIMEZONE = datetime.timezone.utc


def now(tz: timezone | None = None) -> datetime.datetime:
    return datetime.datetime.now(tz=tz if tz else SYSTEM_TIMEZONE)
