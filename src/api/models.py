from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from typing import List
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship


db = SQLAlchemy()


# ======================
# USER (REQUIRED – DO NOT DELETE)
# ======================
class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    surname: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)


    #relationships
    #relationships
    favorites: Mapped[List["User_Course_Favorite"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    messages: Mapped[List["Message"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )

    courses: Mapped[List["User_course"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan"
    )


    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "surname": self.surname,
            "email": self.email,
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

    #relationship
    favorited_course: Mapped[List["User_Course_Favorite"]] = relationship(back_populates="course", cascade="all, delete")
    user_course: Mapped[List["User_course"]] = relationship(back_populates="course", cascade="all, delete")
    coach: Mapped["Coach"] = relationship(back_populates="courses", cascade="all, delete")

    #foreign key
    coach_id: Mapped[int] = mapped_column(ForeignKey("coach.id"), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "cost": self.cost,
            "coach_id": self.coach_id
        }


# ======================
# COACH
# ======================
class Coach(db.Model):
    __tablename__ = "coach"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    messages: Mapped[List["Message"]] = relationship(back_populates="coach", cascade="all, delete-orphan")

    courses: Mapped[List["Course"]] = relationship(back_populates="coach", cascade="all, delete-orphan")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "is_active": self.is_active
        }
    
#ADMIN
class Admin(db.Model):
    __tablename__ = "admin"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(200), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "last_name": self.last_name,
            "email": self.email
        }


#USER COURSE FAVORITE
class User_Course_Favorite (db.Model):
    __tablename__ = "user_course_favorite"

    id: Mapped[int] = mapped_column(primary_key=True)

    #foreign keys
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    course_favorite_id: Mapped[int] = mapped_column(ForeignKey("course.id"), nullable=False)

    #relationsips
    user: Mapped["User"] = relationship(back_populates="favorites")
    course: Mapped["Course"] = relationship(back_populates="favorited_course")

    def serialize(self):
        return {
            "id": self.id,
            "course_favorite_id": self.course_favorite_id,
            "user_id": self.user_id
        }
    

#USER COURSE
class User_course(db.Model):
    __tablename__ = "user_course"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement= True)
    active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    #foreign keys
    course_id: Mapped[int] = mapped_column(ForeignKey("course.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    #relationships
    user: Mapped["User"] = relationship(back_populates="courses")
    course: Mapped["Course"] = relationship(back_populates="user_course")

    def serialize(self):
        return {
            "id": self.id,
            "active": self.active,
            "course_id": self.course_id,
            "user_id": self.user_id
        }


# MESSAGE

class Message(db.Model):
    __tablename__ = "message"

    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(String(500), nullable=False)

    userMessage_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    coachMessage_id: Mapped[int] = mapped_column(ForeignKey("coach.id"))

    user: Mapped["User"] = relationship(back_populates="messages")
    coach: Mapped["Coach"] = relationship(back_populates="messages")

    def serialize(self):
        return {
            "id": self.id,
            "message": self.message,
            "userMessage_id": self.userMessage_id,
            "coachMessage_id": self.coachMessage_id,
        }
