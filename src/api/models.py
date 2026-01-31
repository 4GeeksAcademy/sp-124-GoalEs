from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column
from typing import List
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship


db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    message: Mapped[List["Message"]] = relationship(back_populates="user_message")


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }
    
class Coach(db.Model):
    __tablename__ = "coach"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    #relationships
    course: Mapped[List["Course"]] = relationship(back_populates="auth_course")
    message: Mapped[List["Message"]] = relationship(back_populates="coach_message")


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name": self.last_name,
            "is_active": self.is_active
        }
    
class Course(db.Model):
    __tablename__ = "course"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(300), nullable=False)
    cost: Mapped[int] = mapped_column(Integer, nullable=False)

    #foreign keys
    coach_id: Mapped[int] = mapped_column(ForeignKey("coach.id"), nullable = False)

    #relationships
    auth_course: Mapped["Coach"] = relationship(back_populates="course")


    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "cost": self.cost
        }
    
class Message(db.Model):
    __tablename__ = "message"

    id: Mapped[int] = mapped_column(primary_key=True)
    message: Mapped[str] = mapped_column(String(), nullable=False)

    #foreign key
    coach_id: Mapped[int] = mapped_column(ForeignKey("coach.id"), nullable = False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable = False)

    #relationships
    user_message: Mapped["User"] = relationship(back_populates="message")
    coach_message: Mapped["Coach"] = relationship(back_populates="message")
    


    def serialize(self):
        return {
            "id": self.id,
            "message": self.message
        }