from sqlalchemy.orm import Session

from edurika import models, schemas


def user_create(db: Session, *, obj_in: schemas.UserCreate) -> models.User:
    model = models.User(**obj_in.model_dump())
    db.add(model)
    db.commit()
    db.refresh(model)
    return model


def user_get(db: Session, *, username: str) -> models.User | None:
    return db.query(models.User).filter(models.User.username == username).first()


def user_get_by_username_or_email(db: Session, *, username: str, email: str) -> models.User | None:
    return db.query(models.User).filter(models.User.username == username).filter(models.User.email == email).first()
