import os
import socketio
import stripe
from sqlite3 import IntegrityError
from flask import Blueprint, Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Coach, Course, Message, User_course, User_Course_Favorite, Admin, Category, Tag, course_tag, Appointment, Chat
from api.admin import setup_admin
from api.commands import setup_commands
from api.socket import socketio
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt, verify_jwt_in_request
from datetime import timedelta, timezone, datetime
from functools import wraps
from zoneinfo import ZoneInfo
from dateutil import parser as dtparser
from datetime import datetime, timezone
from flask_socketio import SocketIO, join_room

api = Blueprint("api", __name__)
CORS(api)

# ======================
# TEST
# ======================

# API KEY DE STRIPE
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


@api.route("/hello", methods=["GET", "POST"])
def hello():
    return jsonify({"message": "Backend working"}), 200


def issue_token(identity: int, role: str):
    return create_access_token(
        identity=str(identity),
        additional_claims={"role": role}
    )


# helper, do you have a valid token? are you allowed?
def current_role():
    try:
        return get_jwt().get("role")
    except Exception:
        return None


def role_required(*allowed_roles):
    """
    Usage:
      @role_required("user", "admin")
      def endpoint(): ...
    It will:
      - verify JWT is present
      - check role in token claims
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            role = current_role()
            if role not in allowed_roles:
                return jsonify({"msg": "Forbidden: role not allowed"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def owner_or_admin_required(owner_id: int):
    role = current_role()
    identity = get_jwt_identity()

    if role == "admin":
        return None

    if identity is None:
        return jsonify({"msg": "Missing identity in token"}), 401

    if int(identity) != int(owner_id):
        return jsonify({"msg": "Forbidden: not owner"}), 403

    return None


def coach_owner_or_admin_required(course_coach_id: int):
    role = current_role()
    identity = get_jwt_identity()

    if role == "admin":
        return None

    if role != "coach":
        return jsonify({"msg": "Forbidden: role not allowed"}), 403

    if identity is None or int(identity) != int(course_coach_id):
        return jsonify({"msg": "Forbidden: not course owner"}), 403

    return None


def course_owner_or_admin_required(course_coach_id: int):
    role = current_role()
    identity = get_jwt_identity()

    if role == "admin":
        return None

    # only coach should reach here (because of role_required)
    if identity is None:
        return jsonify({"msg": "Missing identity in token"}), 401

    if int(identity) != int(course_coach_id):
        return jsonify({"msg": "Forbidden: not course owner"}), 403

    return None

# admin only


@api.route('/users', methods=['GET'])
@jwt_required()
@role_required("admin")
def get_users():
    all_user = db.session.execute(select(User)).scalars().all()
    result = [u.serialize() for u in all_user]

    if result is None:
        return jsonify({"msg": "No hay mi bro"})

    response_body = {
        "msg": "We get users",
        "users": result
    }

    return jsonify(response_body), 200

# admin and owner can see the user, but user can't see other user


@api.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
@role_required("user", "admin")
def get_user(user_id):
    forbidden = owner_or_admin_required(user_id)
    if forbidden:
        return forbidden
    user = db.session.execute(select(User).where(
        User.id == user_id)).scalar_one_or_none()

    if user is None:
        return jsonify("User not found"), 404
    return jsonify(user.serialize()), 200

# ===========================
# now Post

# public


@api.route('/users', methods=['POST'])
def created_user():
    body = request.get_json()

    if body is None:
        return jsonify({"error": "Request body is missing"}), 400

    name = body.get("name")
    surname = body.get("surname")
    email = body.get("email")
    password = body.get("password")

    if not name or not surname or not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # if already exists:
    existing_user = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()

    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(name=name, surname=surname, email=email,
                    password=password, is_active=True)

    db.session.add(new_user)
    db.session.commit()

    access_token = issue_token(new_user.id, "user")  # changed

    response_body = {
        "msg": "User created successfully",
        "user": new_user.serialize(),
        "token": access_token
    }

    return jsonify(response_body), 201

# public


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()

    if not body:
        return jsonify({"error": "Missing credentials"}), 400

    email = body.get("email")
    password = body.get("password")

    user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if not user or user.password != password:
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = issue_token(user.id, "user")  # changed

    return jsonify({
        "msg": "Login successful",
        "token": access_token,
        "user": user.serialize()
    }), 200

# public


@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()

    if not body:
        return jsonify({"error": "Missing request body"}), 400

    name = body.get("name")
    surname = body.get("surname")
    email = body.get("email")
    password = body.get("password")

    if not name or not surname or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({"error": "User already exists"}), 409

    new_user = User(
        name=name,
        surname=surname,
        email=email,
        password=password,
        is_active=True
    )

    db.session.add(new_user)
    db.session.commit()

    access_token = issue_token(new_user.id, "user")  # changed

    return jsonify({
        "msg": "Signup successful",
        "token": access_token,
        "user": new_user.serialize()
    }), 201

# follow -CRUD, now it's time to do PUT

# owner or admin can update, but user can't update other user


@api.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
@role_required("user", "admin")
def user_update(user_id):  # changed because it's a function not a data base
    forbidden = owner_or_admin_required(user_id)  # new
    if forbidden:
        return forbidden
    user_update = db.session.execute(select(User).where(
        User.id == user_id)).scalar_one_or_none()

    if user_update is None:  # changed
        return jsonify({"error": "User not found"}), 404

    body = request.get_json()

    if not body:
        return jsonify({"error": "No data provided to update"}), 400

    if "name" in body:
        user_update.name = body["name"]

    if "surname" in body:
        user_update.surname = body["surname"]

    if "email" in body:
        user_update.email = body["email"]

    if "password" in body:
        user_update.password = body["password"]

    if "is_active" in body:
        user_update.is_active = body["is_active"]

    if "age" in body:
        user_update.age = body["age"]

    if "gender" in body:
        user_update.gender = body["gender"]

    if "profile_picture" in body:
        user_update.profile_picture = body["profile_picture"]

    db.session.commit()

    return jsonify(user_update.serialize()), 200

# The last one -  CRUD - DELETE

# owner or admin can delete, but user can't delete other user


@api.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
@role_required("user", "admin")
def user_delete(user_id):  # changed because it's a function not a data base
    forbidden = owner_or_admin_required(user_id)  # new
    if forbidden:
        return forbidden
    deleted = db.session.execute(select(User).where(
        User.id == user_id)).scalar_one_or_none()

    if deleted is None:
        return jsonify({"error": "User not found to delete"}), 404

    db.session.delete(deleted)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200


@api.route("/create-payment-intent", methods=["POST"])
@jwt_required()
def create_payment_intent():

    data = request.get_json()
    print("Stripe Key:", stripe.api_key)

    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    amount = data.get("amount")
    user_id = data.get("user_id")
    course_id = data.get("course_id")

    if amount is None or user_id is None or course_id is None:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        intent = stripe.PaymentIntent.create(
            amount=int(amount),
            currency="eur",
            metadata={
                "user_id": user_id,
                "course_id": course_id
            }
        )

        return jsonify({
            "clientSecret": intent.client_secret
        }), 200

    except stripe.error.StripeError as e:
        return jsonify({"error": str(e)}), 400

# public


@api.route('/coach', methods=['GET'])
def get_coaches():
    all_coaches = Coach.query.all()

    if not all_coaches:
        return jsonify({
            "error": "No coaches found"
        }), 404

    results_coaches = list(map(lambda coach: coach.serialize(), all_coaches))

    response_body = {
        "msg": "This is your GET /coach response",
        "coaches": results_coaches
    }

    return jsonify(response_body), 200

# public


@api.route('/coach/<int:id>', methods=['GET'])
def get_coach(id):
    coach = Coach.query.get(id)

    if coach is None:
        return jsonify({"msg": "Coach not found"}), 404

    response_body = {
        "msg": "This is your GET /coach/<id> response",
        "coach": coach.serialize()
    }

    return jsonify(response_body), 200

# public


@api.route('/coach', methods=['POST'])
def post_coach():
    body = request.get_json()

    if body is None:
        return jsonify({"error": "Missing JSON body"}), 400

    name = body.get("name")
    last_name = body.get("last_name")
    email = body.get("email")
    password = body.get("password")

    if not name or not last_name or not email or not password:
        return jsonify({"error": "name, last_name, email and password are required"}), 400

    new_coach = Coach(
        name=name,
        last_name=last_name,
        email=email,
        password=password,
        is_active=True
    )

    db.session.add(new_coach)
    db.session.commit()

    access_token = issue_token(new_coach.id, "coach")

    response_body = {
        "msg": "Coach created successfully",
        "coach": new_coach.serialize(),
        "token": access_token
    }

    return jsonify(response_body), 201


@api.route("/coach/login", methods=["POST"])
def coach_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    coach = db.session.execute(
        select(Coach).where(Coach.email == email)
    ).scalar_one_or_none()

    if coach is None:
        return jsonify({"error": "Wrong email or password"}), 401

    if coach.password != password:
        return jsonify({"error": "Wrong email or password"}), 401

    access_token = issue_token(coach.id, "coach")  # changed

    return jsonify({
        "msg": "Login successful",
        "token": access_token,
        "coach": coach.serialize()
    }), 200


# private, only for coach and admin
@api.route("/coach/private", methods=["GET"])
@jwt_required()
@role_required("coach", "admin")
def coach_private():
    role = current_role()
    if role == "coach":
        coach_id = int(get_jwt_identity())
    else:
        # admin should pass ?id=123 or use a different endpoint
        coach_id = request.args.get("id", type=int)
        if not coach_id:
            return jsonify({"error": "coach id is required"}), 400

    coach = db.session.execute(
        select(Coach).where(Coach.id == coach_id)
    ).scalar_one_or_none()

    if coach is None:
        return jsonify({"msg": "Coach not found"}), 404  # added

    return jsonify({"coach": coach.serialize()}), 200


@api.route("/coach/<int:coach_id>/courses-students", methods=["GET"])
def coach_students(coach_id):
    courses = Course.query.filter_by(coach_id=coach_id).all()

    result = []
    for course in courses:
        enrolled_count = User_course.query.filter_by(
            course_id=course.id,
            active=True
        ).count()

        course_data = course.serialize()
        course_data['enrolled_students'] = enrolled_count
        result.append(course_data)

    return jsonify(result), 200


@api.route('/coach/<int:coach_id>/courses', methods=['GET'])
def get_coach_courses(coach_id):
    courses = Course.query.filter_by(coach_id=coach_id).all()
    return jsonify([course.serialize() for course in courses]), 200

# private, only for coach and admin, but coach can only update himself


@api.route('/coach/<int:id>', methods=['PUT'])
@jwt_required()
@role_required("coach", "admin")
def put_coach_put(id):
    forbidden = coach_owner_or_admin_required(id)
    if forbidden:
        return forbidden
    coach = Coach.query.get(id)

    if coach is None:
        return jsonify({"error": "Coach not found"}), 404

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Missing JSON body"}), 400

    coach.name = body.get("name", coach.name)
    coach.last_name = body.get("last_name", coach.last_name)
    coach.email = body.get("email", coach.email)
    coach.password = body.get("password", coach.password)
    coach.gender = body.get("gender", coach.gender)
    coach.birthday = body.get("birthday", coach.birthday)
    coach.country = body.get("country", coach.country)
    coach.province = body.get("province", coach.province)
    coach.city = body.get("city", coach.city)
    coach.latitude = body.get("latitude", coach.latitude)
    coach.longitude = body.get("longitude", coach.longitude)
    coach.phone = body.get("phone", coach.phone)
    coach.profile_image = body.get("profile_image", coach.profile_image)

    db.session.commit()

    response_body = {
        "msg": "Coach updated",
        "coach": coach.serialize()
    }

    return jsonify(response_body), 200


@api.route('/coach/<int:coach_id>', methods=['PUT'])
def put_coach(coach_id):
    coach_update = db.session.execute(select(Coach).where(
        Coach.id == coach_id)).scalar_one_or_none()

    if coach_update is None:
        return jsonify({"error": "Coach not found"}), 404

    body = request.get_json()
    if not body:
        return jsonify({"error": "No data provided to update"}), 400
    
    name = body.get("name")
    last_name = body.get("last_name")
    email = body.get("email")
    password = body.get("password")
    is_active = body.get("is_active")
    gender = body.get("gender")
    country = body.get("country")
    province = body.get("province")
    city = body.get("city")
    latitude = body.get("latitude")
    longitude = body.get("longitude")
    phone = body.get("phone")
    birthday = body.get("birthday")
    profile_image = body.get("profile_image")
    
    if len(name)> 0:
        coach_update.name = body["name"]
    if len(last_name)> 0:
        coach_update.last_name = body["last_name"]
    if len(email)> 0:
        coach_update.email = body["email"]
    if len(password)> 0:
        coach_update.password = body["password"]
    if len(is_active) > 0:
        coach_update.is_active = body["is_active"]
    if len(gender)> 0:
        coach_update.gender = body["gender"]
    if len(country)> 0:
        coach_update.country = body["country"]
    if len(province) > 0:
        coach_update.province = body["province"]
    if len(city) > 0:
        coach_update.city = body["city"]
    if len(latitude) > 0:
        coach_update.latitude = body["latitude"]
    if len(longitude) > 0:
        coach_update.longitude = body["longitude"]
    if len(phone) > 0:
        coach_update.phone = body["phone"]
    if (birthday) > 0:
        coach_update.birthday = body["birthday"]
    if len(profile_image) > 0:
        coach_update.profile_image = body["profile_image"]    

    db.session.commit()

    return jsonify(coach_update.serialize()), 200

# private, only for coach and admin, but coach can only delete himself


@api.route('/coach/<int:id>', methods=['DELETE'])
@jwt_required()
@role_required("coach", "admin")
def delete_coach(id):
    forbidden = coach_owner_or_admin_required(id)
    if forbidden:
        return forbidden
    coach = Coach.query.get(id)

    if coach is None:
        return jsonify({"error": "Coach not found"}), 404

    has_courses = db.session.execute(
        select(Course.id).where(Course.coach_id == id)
    ).first()
    if has_courses:
        return jsonify({"error": "Cannot delete coach: coach has courses"}), 409

    db.session.delete(coach)
    db.session.commit()

    return jsonify({"msg": "Coach deleted"}), 200


# public
@api.route("/course", methods=["GET"])
def get_courses():
    courses = db.session.execute(select(Course)).scalars().all()
    return jsonify(courses=[c.serialize() for c in courses]), 200


# public
@api.route("/course/<int:id>", methods=["GET"])
def get_course(id):
    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404

    return jsonify(course=course.serialize()), 200


@api.route('/course/<int:course_id>/enrolled-students', methods=['GET'])
def get_enrolled_students(course_id):
    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404
    enrollments = User_course.query.filter_by(
        course_id=course_id,
        active=True
    ).all()

    students = []
    for enrollment in enrollments:
        user = User.query.get(enrollment.user_id)
        if user:
            students.append({
                "id": user.id,
                "name": user.name,
                "surname": user.surname,
                "email": user.email
            })

    return jsonify({
        "course_title": course.title,
        "students": students
    }), 200


@api.route("/course", methods=["POST"])
@jwt_required()
@role_required("coach", "admin")
def create_course():
    body = request.get_json()
    if body is None:
        return jsonify({"error": "Missing JSON body"}), 400

    if current_role() == "coach":
        coach_id = int(get_jwt_identity())
    else:
        coach_id = body.get("coach_id")

    category_id = body.get("category_id")
    tag_ids = body.get("tag_ids", []) or []

    if (not body.get("title") or not body.get("description")
            or body.get("cost") is None or not coach_id or not category_id):
        return jsonify({"error": "title, description, cost, coach_id, category_id are required"}), 400

    new_course = Course(
        title=body["title"],
        description=body["description"],
        cost=int(body["cost"]),
        coach_id=int(coach_id),
        category_id=int(category_id),
        image_url=body.get("image_url")
    )

    if isinstance(tag_ids, list) and len(tag_ids) > 0:
        tags = db.session.execute(
            select(Tag).where(Tag.id.in_([int(x) for x in tag_ids]))
        ).scalars().all()
        new_course.tags = tags
    else:
        new_course.tags = []

    db.session.add(new_course)
    db.session.commit()
    return jsonify(course=new_course.serialize()), 201


# private, only for coach and admin, but coach can only update his courses
@api.route("/course/<int:id>", methods=["PUT"])
@jwt_required()
@role_required("coach", "admin")
def update_course(id):
    course = db.session.execute(select(Course).where(
        Course.id == id)).scalar_one_or_none()
    if not course:
        return jsonify({"error": "Course not found"}), 404

    forbidden = course_owner_or_admin_required(course.coach_id)
    if forbidden:
        return forbidden

    body = request.get_json()
    if body is None:
        return jsonify({"error": "Missing JSON body"}), 400

    course.title = body["title"]
    course.description = body["description"]
    course.cost = int(body["cost"])
    course.image_url = body.get("image_url", course.image_url)
    course.category_id = int(body.get("category_id", course.category_id))

    tag_ids = body.get("tag_ids", None)
    if tag_ids is not None:
        if isinstance(tag_ids, list) and len(tag_ids) > 0:
            tags = db.session.execute(
                select(Tag).where(Tag.id.in_([int(x) for x in tag_ids]))
            ).scalars().all()
            course.tags = tags
        else:
            course.tags = []

    db.session.commit()
    return jsonify(course=course.serialize()), 200

# private, only for coach and admin, but coach can only delete his courses


@api.route("/course/<int:id>", methods=["DELETE"])
@jwt_required()
@role_required("coach", "admin")
def delete_course(id):
    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404

    forbidden = course_owner_or_admin_required(course.coach_id)
    if forbidden:
        return forbidden

    try:
        # added by arash: delete enrollments/links that reference this course
        db.session.query(User_course).filter(
            User_course.course_id == id).delete(synchronize_session=False)

        # added by arash: delete favorites that reference this course
        db.session.query(User_Course_Favorite).filter(
            User_Course_Favorite.course_favorite_id == id).delete(synchronize_session=False)
        db.session.execute(course_tag.delete().where(
            course_tag.c.course_id == id))

        db.session.delete(course)
        db.session.commit()
        return jsonify({"msg": "Course deleted"}), 200

    except IntegrityError as e:
        db.session.rollback()  # added by arash
        # added by arash
        return jsonify({"error": "Integrity error", "details": str(e)}), 500


@api.route('/coaches/profile', methods=["GET"])
@jwt_required()
def coach_profile():
    coach_id = int(get_jwt_identity())
    coach = Coach.query.get(coach_id)

    return jsonify({"coach": coach.serialize()}), 200


@api.route('/coach/<int:id>/info', methods=['PUT'])
def coach_info(id):
    claims = get_jwt()
    if claims.get("role") != "coach":
        return jsonify({"msg": "Only coach allowed"}), 403
    coach_id = int(get_jwt_identity())

    coach = db.session.execute(select(Coach).where(
        Coach.id == id)).scalar_one_or_none()

    if not coach:
        return jsonify({"error": "Coach not found"}), 400

    body = request.get_json()
    coach.birthday = body["birthday"]
    coach.city = body["city"]
    coach.country = body["country"]
    coach.phone = body["phone"]
    coach.gender = body["gender"]
    coach.profile_image = body["profile_image"]

    db.session.commit()
    return jsonify(coach=coach.serialize()), 200


# public
@api.route('/chat', methods=['GET'])
def get_chat():
    all_chat = db.session.execute(select(Chat)).scalars().all()
    result = [chat.serialize() for chat in all_chat]

    return jsonify({
        "msg": "We get chat",
        "chat": result
    }), 200

# public


@api.route('/chat/<int:chat_id>', methods=['GET'])
def get_message(chat_id):
    chat = db.session.execute(
        select(Chat).where(Chat.id == chat_id)
    ).scalar_one_or_none()

    if chat is None:
        return jsonify({"msg": "Chat not found"}), 404

    return jsonify(chat.serialize()), 200

# public


@api.route('/chat', methods=['POST'])
def create_chat():
    body = request.get_json()

    new_chat = Chat(
        userChat_id=body["userChat_id"],
        coachChat_id=body["coachChat_id"]
    )

    db.session.add(new_chat)
    db.session.commit()

    return jsonify(new_chat.serialize()), 201

# public


@api.route('/chat/<int:chat_id>', methods=['PUT'])
def update_chat(chat_id):
    chat = db.session.execute(
        select(Chat).where(Chat.id == chat_id)
    ).scalar_one_or_none()

    if chat is None:
        return jsonify({"msg": "Chat not found"}), 404

    body = request.get_json()
    chat.chat = body.get("chat", chat.chat)

    db.session.commit()
    return jsonify(chat.serialize()), 200

# public


@api.route('/chat/<int:chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    chat = db.session.execute(
        select(Chat).where(Chat.id == chat_id)
    ).scalar_one_or_none()

    if chat is None:
        return jsonify({"msg": "Chat not found"}), 404

    db.session.delete(chat)
    db.session.commit()

    return jsonify({"msg": "Chat deleted"}), 200


@api.route('/chat/create/<string:role>', methods=['POST'])
@jwt_required()
def create_chat_by_role(role):

    main_id = int(get_jwt_identity())
    secondary_id = request.get_json().get("secondary_id")

    if not secondary_id:
        return jsonify({"error": "secondary_id required"}), 400

    secondary_id = int(secondary_id)

    if role == "user":
        # crear chat si eres user
        user_id = main_id
        coach_id = secondary_id
    elif role == "coach":
        # crear chat si eres coach
        coach_id = main_id
        user_id = secondary_id
    else:
        return jsonify({"error": "role must be user or coach"}), 400

    # evitar duplicados
    existing_chat = Chat.query.filter_by(
        user_id=user_id,
        coach_id=coach_id
    ).first()

    if existing_chat:
        return jsonify(existing_chat.serialize()), 200

    new_chat = Chat(
        user_id=user_id,
        coach_id=coach_id
    )

    db.session.add(new_chat)
    db.session.commit()

    return jsonify(new_chat.serialize()), 201


@api.route('/message/create/<string:role>', methods=['POST'])
@jwt_required()
def create_message_by_role(role):

    try:
        main_id = int(get_jwt_identity())
        data = request.get_json()

        secondary_id = data.get("secondary_id")
        text = data.get("text")

        if not secondary_id or not text:
            return jsonify({"error": "secondary_id and text required"}), 400

        secondary_id = int(secondary_id)

        if role == "user":
            user_id = main_id
            coach_id = secondary_id
        elif role == "coach":
            coach_id = main_id
            user_id = secondary_id
        else:
            return jsonify({"error": "role must be user or coach"}), 400

        chat = Chat.query.filter_by(
            user_id=user_id,
            coach_id=coach_id
        ).first()

        if not chat:
            chat = Chat(
                user_id=user_id,
                coach_id=coach_id
            )
            db.session.add(chat)
            db.session.flush()

        new_message = Message(
            chat_id=chat.id,
            sender_id=main_id,
            sender_role=role,
            text=text
        )

        db.session.add(new_message)
        chat.last_updated = datetime.now(timezone.utc)

        db.session.commit()

        socketio.emit(
            "new_message",
            new_message.serialize(),
            room=f"chat_{chat.id}"
        )

        return jsonify(new_message.serialize()), 201

    except Exception as error:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(error)}), 500


@api.route('/chats', methods=['GET'])
@jwt_required()
def get_my_chats():

    main_id = get_jwt_identity()

    chats = Chat.query.filter(
        (Chat.user_id == main_id) | (Chat.coach_id == main_id)
    ).order_by(Chat.last_updated.desc()).all()

    return jsonify([chat.serialize() for chat in chats]), 200


@api.route('/chats/<int:chat_id>/messages', methods=['GET'])
@jwt_required()
def get_chat_messages(chat_id):

    main_id = int(get_jwt_identity())

    chat = Chat.query.get(chat_id)

    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    if chat.user_id != main_id and chat.coach_id != main_id:
        return jsonify({"error": "Unauthorized"}), 403

    messages = Message.query.filter_by(chat_id=chat_id)\
                            .order_by(Message.id.asc())\
                            .all()

    return jsonify([m.serialize() for m in messages]), 200

@api.route('/chats/<int:chat_id>', methods=['DELETE'])
@jwt_required()
def delete_chats(chat_id):

    main_id = int(get_jwt_identity())
    chat = Chat.query.get(chat_id)

    if not chat:
        return jsonify({"error": "Chat not found"}), 404

    if chat.user_id != main_id and chat.coach_id != main_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(chat)
    db.session.commit()

    return jsonify({"msg": "Chat deleted"}), 200


@api.route('/user_course', methods=['GET'])
def get_user_courses():
    all_user_courses = User_course.query.all()

    if not all_user_courses:
        return jsonify({
            "msg": "No user-course records found",
            "user_courses": []
        }), 200

    results_user_courses = list(
        map(lambda user_course: user_course.serialize(), all_user_courses))

    response_body = {
        "msg": "This is your GET /user_course response",
        "user_courses": results_user_courses
    }

    return jsonify(response_body), 200


@api.route('/user_course/<int:id>', methods=['GET'])
def get_user_course(id):
    user_course = User_course.query.get(id)

    if user_course is None:
        return jsonify({"msg": "User-course not found"}), 404

    response_body = {
        "msg": "This is your GET /user_course/<id> response",
        "user_course": user_course.serialize()
    }

    return jsonify(response_body), 200


@api.route('/user_course', methods=['POST'])
def post_user_course():
    body = request.get_json()

    if body is None:
        return jsonify({"error": "Missing JSON body"}), 400

    active = body.get("active")
    course_id = body.get("course_id")
    user_id = body.get("user_id")

    if active is None or not course_id or not user_id:
        return jsonify({
            "error": "active, course_id and user_id are required"
        }), 400

    new_user_course = User_course(
        active=active,
        course_id=course_id,
        user_id=user_id
    )

    db.session.add(new_user_course)
    db.session.commit()

    response_body = {
        "msg": "User-course created successfully"
    }

    return jsonify(response_body), 201


@api.route('/user_course/<int:id>', methods=['PUT'])
def put_user_course(id):
    user_course = User_course.query.get(id)

    if user_course is None:
        return jsonify({"error": "User-course not found"}), 404

    body = request.get_json()

    if body is None:
        return jsonify({"error": "Missing JSON body"}), 400

    user_course.active = body.get("active", user_course.active)
    user_course.course_id = body.get("course_id", user_course.course_id)
    user_course.user_id = body.get("user_id", user_course.user_id)

    db.session.commit()

    response_body = {
        "msg": "User_course updated",
        "user_course": user_course.serialize()
    }

    return jsonify(response_body), 200


@api.route('/user_course/<int:id>', methods=['DELETE'])
def delete_user_course(id):
    user_course = User_course.query.get(id)

    if user_course is None:
        return jsonify({"error": "User-course not found"}), 404

    db.session.delete(user_course)
    db.session.commit()

    return jsonify({"msg": "User-course deleted"}), 200


@api.route("/users/<int:user_id>/favorites/<int:course_id>", methods=["POST"])
@jwt_required()
@role_required("user", "admin")
def add_favorite(user_id, course_id):
    forbidden = owner_or_admin_required(user_id)
    if forbidden:
        return forbidden

    exists = User_Course_Favorite.query.filter_by(
        user_id=user_id,
        course_favorite_id=course_id
    ).first()

    if exists:
        return jsonify({"error": "Already favorite"}), 409

    fav = User_Course_Favorite(
        user_id=user_id,
        course_favorite_id=course_id
    )

    db.session.add(fav)
    db.session.commit()

    return jsonify(fav.serialize()), 201


@api.route("/users/<int:user_id>/favorites", methods=["GET"])
@jwt_required()
@role_required("user", "admin")
def get_user_favorites(user_id):
    forbidden = owner_or_admin_required(user_id)
    if forbidden:
        return forbidden

    favorites = User_Course_Favorite.query.filter_by(user_id=user_id).all()

    results = []
    for fav in favorites:
        course = Course.query.get(fav.course_favorite_id)
        results.append({
            "id": fav.id,
            "course": course.serialize()
        })

    return jsonify({"favorites": results}), 200


@api.route("/users/<int:user_id>/favorites/<int:course_id>", methods=["DELETE"])
@jwt_required()
@role_required("user", "admin")
def remove_favorite(user_id, course_id):
    forbidden = owner_or_admin_required(user_id)
    if forbidden:
        return forbidden

    fav = User_Course_Favorite.query.filter_by(
        user_id=user_id,
        course_favorite_id=course_id
    ).first()

    if not fav:
        return jsonify({"error": "Favorite not found"}), 404

    db.session.delete(fav)
    db.session.commit()

    return jsonify({"msg": "Favorite removed"}), 200


@api.route("/users/<int:user_id>/favorites/<int:course_id>", methods=["PUT"])
@jwt_required()
@role_required("user", "admin")
def modificar_favorite(user_id, course_id):
    favorite = User_Course_Favorite.query.filter_by(
        user_id=user_id,
        course_favorite_id=course_id
    ).first()

    if favorite:
        return jsonify({
            "msg": "Already in favorites",
            "favorite": favorite.serialize()
        }), 200

    new_favorite = User_Course_Favorite(
        user_id=user_id,
        course_favorite_id=course_id
    )

    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({
        "msg": "Favorite added",
        "favorite": new_favorite.serialize()
    }), 201


@api.route('/admin/login', methods=['POST'])
def login_admin():
    body = request.get_json()

    if not body:
        return jsonify({"error": "Missing credentials"}), 400

    email = body.get("email")
    password = body.get("password")

    admin = db.session.execute(
        select(Admin).where(Admin.email == email)
    ).scalar_one_or_none()

    if not admin or admin.password != password:
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = issue_token(admin.id, "admin")  # changed

    return jsonify({
        "msg": "Admin login successful",
        "token": access_token,
        "admin": admin.serialize()
    }), 200


@api.route("/admin/signup", methods=["POST"])
def admin_signup():
    body = request.get_json()
    if not body:
        return jsonify({"error": "Missing request body"}), 400

    name = body.get("name")
    last_name = body.get("last_name")
    email = body.get("email")
    password = body.get("password")

    if not name or not last_name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    existing = db.session.execute(select(Admin).where(
        Admin.email == email)).scalar_one_or_none()
    if existing:
        return jsonify({"error": "Admin already exists"}), 409

    new_admin = Admin(
        name=name,
        last_name=last_name,
        email=email,
        password=password,
        is_active=True
    )
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "msg": "Signup admin successful",
        "admin": new_admin.serialize()
        # "token": token
    }), 201


# CATEGORY

# Public
@api.route("/categories", methods=["GET"])
def get_categories():
    categories = db.session.execute(
        select(Category).where(Category.is_active == True)
    ).scalars().all()

    return jsonify(categories=[c.serialize() for c in categories]), 200

# admin only


@api.route("/categories", methods=["POST"])
@jwt_required()
@role_required("admin")
def create_category():
    body = request.get_json()
    if not body:
        return jsonify({"error": "Missing JSON body"}), 400

    name = body.get("name")
    if not name:
        return jsonify({"error": "name is required"}), 400

    exists = db.session.execute(
        select(Category).where(Category.name == name)
    ).scalar_one_or_none()
    if exists:
        return jsonify({"error": "Category already exists"}), 409

    new_cat = Category(
        name=name,
        description=body.get("description"),
        is_active=body.get("is_active", True)
    )

    db.session.add(new_cat)
    db.session.commit()

    return jsonify(category=new_cat.serialize()), 201

# admin only


@api.route("/categories/<int:cat_id>", methods=["PUT"])
@jwt_required()
@role_required("admin")
def update_category(cat_id):
    category = db.session.execute(select(Category).where(
        Category.id == cat_id)).scalar_one_or_none()
    if not category:
        return jsonify({"error": "Category not found"}), 404

    body = request.get_json()
    if not body:
        return jsonify({"error": "Missing JSON body"}), 400

    if "name" in body:
        # prevent duplicates
        exists = db.session.execute(
            select(Category).where(Category.name ==
                                   body["name"], Category.id != cat_id)
        ).scalar_one_or_none()
        if exists:
            return jsonify({"error": "Category name already used"}), 409
        category.name = body["name"]

    if "description" in body:
        category.description = body["description"]

    if "is_active" in body:
        category.is_active = body["is_active"]

    db.session.commit()
    return jsonify(category=category.serialize()), 200

# admin only


@api.route("/categories/<int:cat_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_category(cat_id):
    category = db.session.execute(select(Category).where(
        Category.id == cat_id)).scalar_one_or_none()
    if not category:
        return jsonify({"error": "Category not found"}), 404

    # if category has courses block delete
    has_courses = db.session.execute(
        select(Course.id).where(Course.category_id == cat_id)
    ).first()

    if has_courses:
        return jsonify({"error": "Cannot delete category: category has courses"}), 409

    db.session.delete(category)
    db.session.commit()
    return jsonify({"msg": "Category deleted"}), 200


# public
@api.route("/tags", methods=["GET"])
def get_tags():
    tags = db.session.execute(
        select(Tag).where(Tag.is_active == True)
    ).scalars().all()

    return jsonify(tags=[t.serialize() for t in tags]), 200


# admin only
@api.route("/tags", methods=["POST"])
@jwt_required()
@role_required("admin")
def create_tag():
    body = request.get_json()
    if not body:
        return jsonify({"error": "Missing JSON body"}), 400

    name = body.get("name")
    if not name or not name.strip():
        return jsonify({"error": "name is required"}), 400

    name = name.strip()

    exists = db.session.execute(
        select(Tag).where(Tag.name == name)
    ).scalar_one_or_none()
    if exists:
        return jsonify({"error": "Tag already exists"}), 409

    new_tag = Tag(
        name=name,
        description=body.get("description"),
        is_active=body.get("is_active", True)
    )

    db.session.add(new_tag)
    db.session.commit()

    return jsonify(tag=new_tag.serialize()), 201


# admin only
@api.route("/tags/<int:tag_id>", methods=["PUT"])
@jwt_required()
@role_required("admin")
def update_tag(tag_id):
    tag = db.session.execute(
        select(Tag).where(Tag.id == tag_id)
    ).scalar_one_or_none()

    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    body = request.get_json()
    if not body:
        return jsonify({"error": "Missing JSON body"}), 400

    if "name" in body:
        new_name = (body.get("name") or "").strip()
        if not new_name:
            return jsonify({"error": "name is required"}), 400

        exists = db.session.execute(
            select(Tag).where(Tag.name == new_name, Tag.id != tag_id)
        ).scalar_one_or_none()
        if exists:
            return jsonify({"error": "Tag name already used"}), 409

        tag.name = new_name

    if "description" in body:
        tag.description = body.get("description")

    if "is_active" in body:
        tag.is_active = body.get("is_active")

    db.session.commit()
    return jsonify(tag=tag.serialize()), 200


# admin only
@api.route("/tags/<int:tag_id>", methods=["DELETE"])
@jwt_required()
@role_required("admin")
def delete_tag(tag_id):
    tag = db.session.execute(
        select(Tag).where(Tag.id == tag_id)
    ).scalar_one_or_none()

    if not tag:
        return jsonify({"error": "Tag not found"}), 404

    # delete association rows first (avoid FK error)
    db.session.execute(
        course_tag.delete().where(course_tag.c.tag_id == tag_id)
    )

    db.session.delete(tag)
    db.session.commit()
    return jsonify({"msg": "Tag deleted"}), 200


#APPOINTMENTS
#private, only for user and admin, but user can only create for himself
@api.route("/appointments", methods=["POST"])
@jwt_required()
@role_required("user", "admin")
def create_appointment():
    role = current_role()

    body = request.get_json()
    if not body:
        return jsonify({"error": "Missing JSON body"}), 400

    #  user_id logic
    if role == "user":
        user_id = int(get_jwt_identity())
    else:  # admin
        user_id = body.get("user_id")
        if not user_id:
            return jsonify({"error": "user_id is required for admin"}), 400
        user_id = int(user_id)

    coach_id = body.get("coach_id")
    starts_at_raw = body.get("starts_at")
    note = body.get("note")

    if not coach_id or not starts_at_raw:
        return jsonify({"error": "coach_id and starts_at are required"}), 400

    #  validate user exists (recommended minimal)
    user = db.session.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if not user:
        return jsonify({"error": "User not found"}), 404

    coach = db.session.execute(select(Coach).where(Coach.id == int(coach_id))).scalar_one_or_none()
    if not coach:
        return jsonify({"error": "Coach not found"}), 404

    # parse starts_at
    try:
        dt = dtparser.isoparse(starts_at_raw)
    except Exception:
        return jsonify({"error": "Invalid starts_at format. Use ISO8601"}), 400

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo("Europe/Madrid"))

    starts_at_utc = dt.astimezone(timezone.utc)
    now_utc = datetime.now(timezone.utc)

    if starts_at_utc <= now_utc:
        return jsonify({"error": "starts_at must be in the future"}), 400

    appt = Appointment(
        user_id=user_id,
        coach_id=int(coach_id),
        starts_at=starts_at_utc,
        status="pending",
        note=note
    )

    db.session.add(appt)
    db.session.commit()

    return jsonify(appointment=appt.serialize()), 201

#user can see only his appointments, admin can see all but should pass user_id as query param
@api.route("/appointments/my", methods=["GET"])
@jwt_required()
@role_required("user","admin")
def get_my_appointments():
    role = current_role()

    q = select(Appointment).order_by(Appointment.starts_at.desc())

    if role == "user":
        user_id = int(get_jwt_identity())
        q = q.where(Appointment.user_id == user_id)

    else:  # admin
        user_id = request.args.get("user_id", type=int)
        if user_id:
            q = q.where(Appointment.user_id == user_id)
        # else: no filter => all appointments

    apits = db.session.execute(q).scalars().all()

    return jsonify(appointments=[a.serialize() for a in apits]), 200


#coach can see only his appointments, admin can see all but should pass coach_id as query param
@api.route("/coach/appointments/my", methods=["GET"])
@jwt_required()
@role_required("coach", "admin")
def get_my_coach_appointments():
    role = current_role()

    q = select(Appointment).order_by(Appointment.starts_at.desc())

    if role == "coach":
        coach_id = int(get_jwt_identity())
        q = q.where(Appointment.coach_id == coach_id)

    else:  # admin
        coach_id = request.args.get("coach_id", type=int)
        if coach_id:
            q = q.where(Appointment.coach_id == coach_id)
        # else: all appointments

    apits = db.session.execute(q).scalars().all()
    return jsonify(appointments=[a.serialize() for a in apits]), 200


#admin can update status of any appointment, coach can update only his appointments
@api.route("/coach/appointments/<int:apit_id>", methods=["PUT"])
@jwt_required()
@role_required("coach", "admin")
def coach_update_appointment(apit_id):
    role = current_role()
    identity = int(get_jwt_identity())

    apit = db.session.execute(select(Appointment).where(Appointment.id == apit_id)).scalar_one_or_none()
    if not apit:
        return jsonify({"error": "Appointment not found"}), 404

    if role == "coach" and int(apit.coach_id) != identity:
        return jsonify({"error": "Forbidden: not your appointment"}), 403

    body = request.get_json()
    if not body:
        return jsonify({"error": "Missing JSON body"}), 400

    status = body.get("status")
    if status not in ["approved", "rejected", "canceled"]:
        return jsonify({"error": "status must be one of: approved, rejected, canceled"}), 400

    apit.status = status
    db.session.commit()

    return jsonify(appointment=apit.serialize()), 200


#user can cancel only his appointments and only if coach hasn't approved/rejected yet
@api.route("/appointments/<int:apit_id>", methods=["PUT"])
@jwt_required()
@role_required("user", "admin")
def user_cancel_appointment(apit_id):
    role = current_role()
    identity = int(get_jwt_identity())

    apit = db.session.execute(select(Appointment).where(Appointment.id == apit_id)).scalar_one_or_none()
    if not apit:
        return jsonify({"error": "Appointment not found"}), 404

    if role == "user" and int(apit.user_id) != identity:
        return jsonify({"error": "Forbidden: not your appointment"}), 403

    body = request.get_json() or {}
    action = body.get("action")

    if action != "cancel":
        return jsonify({"error": "Use action: cancel"}), 400

    apit.status = "canceled"
    db.session.commit()

    return jsonify(appointment=apit.serialize()), 200
