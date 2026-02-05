from flask import Blueprint, request, jsonify
from sqlalchemy import select
from api.models import db, User, Coach, Course
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint("api", __name__)
CORS(api)

# ======================
# TEST
# ======================


@api.route("/hello", methods=["GET", "POST"])
def hello():
    return jsonify({"message": "Backend working"}), 200


# ======================
# COURSE ROUTES
# ======================
@api.route("/course", methods=["GET"])
def get_courses():
    courses = db.session.execute(select(Course)).scalars().all()
    return jsonify(courses=[c.serialize() for c in courses]), 200


@api.route("/course/<int:id>", methods=["GET"])
def get_course(id):
    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404

    return jsonify(course=course.serialize()), 200


@api.route("/course", methods=["POST"])
def create_course():
    body = request.get_json()

    new_course = Course(
        title=body["title"],
        description=body["description"],
        cost=int(body["cost"])
    )

    db.session.add(new_course)
    db.session.commit()

    return jsonify(course=new_course.serialize()), 201


@api.route("/course/<int:id>", methods=["PUT"])
def update_course(id):
    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404

    body = request.get_json()
    course.title = body["title"]
    course.description = body["description"]
    course.cost = int(body["cost"])

    db.session.commit()
    return jsonify(course=course.serialize()), 200


@api.route("/course/<int:id>", methods=["DELETE"])
def delete_course(id):
    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404

    db.session.delete(course)
    db.session.commit()
    return jsonify({"msg": "Course deleted"}), 200
