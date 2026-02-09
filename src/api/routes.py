from flask import Blueprint, request, jsonify
from sqlalchemy import select
from api.models import db, User, Coach, Course, User_course, Message
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


@api.route('/users', methods=['GET'])
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

@api.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.execute(select(User).where(User.id == user_id)).scalar_one_or_none()

    if user is None:
        return jsonify("User not found"), 404
    return jsonify(user.serialize()), 200

## ===========================
## now Post 

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
    
    ## if already exists:
    existing_user = db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    if existing_user:
        return jsonify({"error": "User already exists"}), 409
    
    new_user = User(name=name, surname=surname,email=email, password=password, is_active=True)

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201

## follow -CRUD, now it's time to do PUT

@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user_update = db.session.execute(select(User).where(User.id == user_id)).scalar_one_or_none()

    if update_user is None:
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

    db.session.commit()      

    return jsonify(user_update.serialize()), 200 

## The last one -  CRUD - DELETE

@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    deleted = db.session.execute(select(User).where(User.id == user_id)).scalar_one_or_none()

    if deleted is None:
        return jsonify({"error": "User not found to delete"}), 404 
    
    db.session.delete(deleted)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

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
        name = name,
        last_name = last_name,
        email = email,
        password = password,
        is_active = True
    )
    print("print anted de print new coach")
    print (new_coach)
    db.session.add(new_coach)
    db.session.commit()

    response_body = {
        "msg": "Coach created successfully"
        #"new_coach": new_coach.serialize()
    }

    return jsonify(response_body), 201

@api.route('/coach/<int:id>', methods=['PUT'])
def put_coach(id):
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

    db.session.commit()

    response_body = {
        "msg": "Coach updated",
        "coach": coach.serialize()
    }

    return jsonify(response_body), 200

@api.route('/coach/<int:id>', methods=['DELETE'])
def delete_coach(id):
    coach = Coach.query.get(id)

    if coach is None:
        return jsonify({"error": "Coach not found"}), 404
    
    db.session.delete(coach)
    db.session.commit()
    
    return jsonify({"msg": "Coach deleted"}), 200

@api.route("/course", methods=["GET"])
def get_courses():
    print("hola desde get course")
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

@api.route('/messages', methods=['GET'])
def get_messages():
    all_messages = db.session.execute(select(Message)).scalars().all()
    result = [m.serialize() for m in all_messages]

    return jsonify({
        "msg": "We get messages",
        "messages": result
    }), 200

@api.route('/messages/<int:message_id>', methods=['GET'])
def get_message(message_id):
    message = db.session.execute(
        select(Message).where(Message.id == message_id)
    ).scalar_one_or_none()

    if message is None:
        return jsonify({"msg": "Message not found"}), 404

    return jsonify(message.serialize()), 200

@api.route('/messages', methods=['POST'])
def create_message():
    body = request.get_json()

    new_message = Message(
        message=body["message"],
        userMessage_id=body["userMessage_id"],
        coachMessage_id=body["coachMessage_id"]
    )

    db.session.add(new_message)
    db.session.commit()

    return jsonify(new_message.serialize()), 201

@api.route('/messages/<int:message_id>', methods=['PUT'])
def update_message(message_id):
    message = db.session.execute(
        select(Message).where(Message.id == message_id)
    ).scalar_one_or_none()

    if message is None:
        return jsonify({"msg": "Message not found"}), 404

    body = request.get_json()
    message.message = body.get("message", message.message)

    db.session.commit()
    return jsonify(message.serialize()), 200

@api.route('/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    message = db.session.execute(
        select(Message).where(Message.id == message_id)
    ).scalar_one_or_none()

    if message is None:
        return jsonify({"msg": "Message not found"}), 404

    db.session.delete(message)
    db.session.commit()

    return jsonify({"msg": "Message deleted"}), 200

@api.route('/user_course', methods=['GET'])
def get_user_courses():
    all_user_courses = User_course.query.all()

    if not all_user_courses:
        return jsonify({
            "error": "No user-course records found"
        }), 404

    results_user_courses = list(map(lambda user_course: user_course.serialize(), all_user_courses))

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
        active = active,
        course_id = course_id,
        user_id = user_id
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