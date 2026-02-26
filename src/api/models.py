from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from typing import List
from sqlalchemy import ForeignKey, UniqueConstraint, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from datetime import date, datetime, timezone


db = SQLAlchemy()

course_tag = db.Table(
    "course_tag",
    db.Column("course_id", db.Integer, db.ForeignKey(
        "course.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tag.id"), primary_key=True),
)


# ======================
# USER (REQUIRED – DO NOT DELETE)
# ======================
class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    surname: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=True)
    gender: Mapped[str] = mapped_column(String(50), nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # relationships
    favorites: Mapped[List["User_Course_Favorite"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    chats: Mapped[List["Chat"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    courses: Mapped[List["User_course"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    appointments: Mapped[List["Appointment"]] = relationship(back_populates="user", cascade="all, delete-orphan")


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "surname": self.surname,
            "email": self.email,
            "gender": self.gender,
            "age": self.age,
            "profile_picture": self.profile_picture
        }

    def __str__(self):
        return f"{self.name} {self.surname}"


# ======================
# COURSE
# ======================
class Course(db.Model):
    __tablename__ = "course"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(300), nullable=False)
    cost: Mapped[int] = mapped_column(Integer, nullable=False)
    image_url = db.Column(db.String(500), nullable=True)

    # relationship
    favorited_course: Mapped[List["User_Course_Favorite"]] = relationship(
        back_populates="course", cascade="all, delete-orphan")
    user_course: Mapped[List["User_course"]
                        ] = relationship(back_populates="course")
    coach: Mapped["Coach"] = relationship(back_populates="courses")
    category: Mapped["Category"] = relationship(back_populates="courses")
    tags: Mapped[List["Tag"]] = relationship(
        secondary=course_tag, back_populates="courses")

    # foreign key
    coach_id: Mapped[int] = mapped_column(ForeignKey("coach.id"))
    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "cost": self.cost,
            "coach_id": self.coach_id,
            "category_id": self.category_id,
            "image_url": self.image_url,
            "category": self.category.serialize() if self.category else None,
            "tags": [t.serialize() for t in self.tags] if self.tags else []

        }


# CATEGORY
class Category(db.Model):
    __tablename__ = "category"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(300), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    # relatioship
    courses: Mapped[List["Course"]] = relationship(back_populates="category")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active
        }


# TAGS
class Tag(db.Model):
    __tablename__ = "tag"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    description: Mapped[str] = mapped_column(String(300), nullable=True)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    courses: Mapped[List["Course"]] = relationship(
        secondary=course_tag, back_populates="tags")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "is_active": self.is_active
        }


# ======================
# COACH
# ======================
class Coach(db.Model):
    __tablename__ = "coach"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    gender: Mapped[str] = mapped_column(String(50), nullable=True)
    birthday: Mapped[date] = mapped_column(db.Date, nullable=True)
    country: Mapped[str] = mapped_column(String(120), nullable=True)
    province: Mapped[str] = mapped_column(String(120), nullable=True)
    city: Mapped[str] = mapped_column(String(120), nullable=True)
    latitude: Mapped[float] = mapped_column(db.Float, nullable=True)
    longitude: Mapped[float] = mapped_column(db.Float, nullable=True)
    phone: Mapped[str] = mapped_column(String(120), nullable=True)
    profile_image: Mapped[str] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    chats: Mapped[List["Chat"]] = relationship(
        back_populates="coach", cascade="all, delete-orphan")

    courses: Mapped[List["Course"]] = relationship(
        back_populates="coach", cascade="all, delete-orphan")

    appointments: Mapped[List["Appointment"]] = relationship(back_populates="coach", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "birthday": self.birthday.isoformat() if self.birthday else None,
            "country": self.country,
            "province": self.province,
            "city": self.city,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "phone": self.phone,
            "profile_image": self.profile_image,
            "gender": self.gender,
            "is_active": self.is_active
        }
    

# APPOINTMENT
class Appointment(db.Model):
    __tablename__ = "appointment"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    coach_id: Mapped[int] = mapped_column(ForeignKey("coach.id"), nullable=False)

    starts_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    note: Mapped[str] = mapped_column(String(300), nullable=True)

    created_at: Mapped[datetime] = mapped_column( DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

    # relationships
    user: Mapped["User"] = relationship(back_populates="appointments")
    coach: Mapped["Coach"] = relationship(back_populates="appointments")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "coach_id": self.coach_id,
            "starts_at": self.starts_at.isoformat() if self.starts_at else None,
            "status": self.status,
            "note": self.note,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

#ADMIN
class Admin(db.Model):
    __tablename__ = "admin"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email
        }


# USER COURSE FAVORITE
class User_Course_Favorite (db.Model):
    __tablename__ = "user_course_favorite"

    id: Mapped[int] = mapped_column(primary_key=True)

    # foreign keys
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    course_favorite_id: Mapped[int] = mapped_column(
        ForeignKey("course.id"), nullable=False)

    # relationsips
    user: Mapped["User"] = relationship(back_populates="favorites")
    course: Mapped["Course"] = relationship(back_populates="favorited_course")

    def serialize(self):
        return {
            "id": self.id,
            "course_favorite_id": self.course_favorite_id,
            "user_id": self.user_id
        }


# USER COURSE
class User_course(db.Model):
    __tablename__ = "user_course"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # foreign keys
    course_id: Mapped[int] = mapped_column(ForeignKey("course.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    # relationships
    user: Mapped["User"] = relationship(back_populates="courses")
    course: Mapped["Course"] = relationship(back_populates="user_course")

    def serialize(self):
        return {
            "id": self.id,
            "active": self.active,
            "course_id": self.course_id,
            "user_id": self.user_id
        }


# CHAT

class Chat(db.Model):
    __tablename__ = "chat"

    __table_args__ = (
        UniqueConstraint("user_id", "coach_id", name="unique_chat_pair"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    last_updated: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc))

    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    coach_id: Mapped[int] = mapped_column(ForeignKey("coach.id"))

    messages: Mapped[List["Message"]] = relationship(
        back_populates="chat",
        cascade="all, delete-orphan"
    )

    user: Mapped["User"] = relationship(back_populates="chats")
    coach: Mapped["Coach"] = relationship(back_populates="chats")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "coach_id": self.coach_id,
            "last_updated": self.last_updated.isoformat() if self.last_updated else None,
            "user_name": self.user.name if self.user else None,
            "coach_name": self.coach.name if self.coach else None,
            "messages": [message.serialize() for message in self.messages]
        }


class Message(db.Model):
    __tablename__ = "message"

    id: Mapped[int] = mapped_column(primary_key=True)

    chat_id: Mapped[int] = mapped_column(
        ForeignKey("chat.id"),
        nullable=False,
        index=True
    )

    sender_id: Mapped[int] = mapped_column(nullable=False)
    sender_role: Mapped[str] = mapped_column(String(10), nullable=False)

    text: Mapped[str] = mapped_column(String(150), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        default=lambda: datetime.now(timezone.utc)
    )

    chat: Mapped["Chat"] = relationship(back_populates="messages")

    def serialize(self):
        return {
            "id": self.id,
            "chat_id": self.chat_id,
            "sender_id": self.sender_id,
            "sender_role": self.sender_role,
            "text": self.text,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
