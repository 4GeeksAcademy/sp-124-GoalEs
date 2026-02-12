"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Coach, Course, Message, User_course
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
import hashlib
from datetime import timedelta



# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "anything that is very difficult to read54321"
jwt = JWTManager(app)
app.url_map.strict_slashes = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers=["Content-Type", "Authorization"])


app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints

def hash_password(password: str) -> str:
 return hashlib.sha256(password.encode("utf-8")).hexdigest()


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/users', methods=['GET'])
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

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = db.session.execute(select(User).where(User.id == user_id)).scalar_one_or_none()

    if user is None:
        return jsonify("User not found"), 404
    return jsonify(user.serialize()), 200

## ===========================
## now Post 

@app.route('/users', methods=['POST'])
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

@app.route('/users/<int:user_id>', methods=['PUT'])
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

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    deleted = db.session.execute(select(User).where(User.id == user_id)).scalar_one_or_none()

    if deleted is None:
        return jsonify({"error": "User not found to delete"}), 404 
    
    db.session.delete(deleted)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

@app.route('/coach', methods=['GET'])
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

@app.route('/coach/<int:id>', methods=['GET'])
def get_coach(id):
    coach = Coach.query.get(id)

    if coach is None:
        return jsonify({"msg": "Coach not found"}), 404

    response_body = {
        "msg": "This is your GET /coach/<id> response",
        "coach": coach.serialize()
    }

    return jsonify(response_body), 200

@app.route('/coach', methods=['POST'])
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
        password =hash_password(password),
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



@app.route("/coach/token", methods=["POST"])
def coach_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    
    coach = db.session.execute(select(Coach).where(Coach.email == email)).scalar_one_or_none()

    if coach is None:
        return jsonify({"error": "Wrong email or password"}), 401
    
    if coach.password != hash_password(password):
        return jsonify({"error": "Wrong email or password"}), 401
    
    access_token = create_access_token(
        identity=str(coach.id),
        additional_claims={"role": "coach"} )
    
    return jsonify({
        "token": access_token,
        "coach_id": coach.id
    }), 200

@app.route("/coach/private", methods=["GET"])
@jwt_required()
def coach_private():
    claims = get_jwt()
    if claims.get("role") != "coach":
     return jsonify({"Attention": "Only coach allowed"}), 403
    
    coach_id = int(get_jwt_identity())
    coach = Coach.query.get(coach_id)

    return jsonify({"coach": coach.serialize()}), 200

@app.route('/coach/<int:id>', methods=['PUT'])
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

@app.route('/coach/<int:id>', methods=['DELETE'])
def delete_coach(id):
    coach = Coach.query.get(id)

    if coach is None:
        return jsonify({"error": "Coach not found"}), 404
    
    db.session.delete(coach)
    db.session.commit()
    
    return jsonify({"msg": "Coach deleted"}), 200

@app.route("/course", methods=["GET"])
def get_courses():
    print("hola desde get course")
    courses = db.session.execute(select(Course)).scalars().all()
    return jsonify(courses=[c.serialize() for c in courses]), 200


@app.route("/course/<int:id>", methods=["GET"])
def get_course(id):
    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404

    return jsonify(course=course.serialize()), 200


@app.route("/course", methods=["POST"])
@jwt_required()
def create_course():
    claims = get_jwt()
    if claims.get("role") != "coach":
        return jsonify({"msg": "Only coach allowed"}), 403
    body = request.get_json()
    identity = get_jwt_identity()
    coach_id = int(identity)

    new_course = Course(
        title=body["title"],
        description=body["description"],
        cost=int(body["cost"]),
        coach_id=coach_id
    )

    db.session.add(new_course)
    db.session.commit()

    return jsonify(course=new_course.serialize()), 201


@app.route("/course/<int:id>", methods=["PUT"])
@jwt_required()
def update_course(id):
    claims = get_jwt()
    if claims.get("role") != "coach":
        return jsonify({"msg": "Only coach allowed"}), 403
    coach_id = int(get_jwt_identity())

    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404
    
    if course.coach_id != coach_id:
        return jsonify({"msg": "Not your course"}), 403

    body = request.get_json()
    course.title = body["title"]
    course.description = body["description"]
    course.cost = int(body["cost"])

    db.session.commit()
    return jsonify(course=course.serialize()), 200


@app.route("/course/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_course(id):
    claims = get_jwt()
    if claims.get("role") != "coach":
        return jsonify({"msg": "Only coach allowed"}), 403
    
    coach_id = int(get_jwt_identity())

    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404
    
    if course.coach_id != coach_id:
        return jsonify({"msg": "Not your course"}), 403

    db.session.delete(course)
    db.session.commit()
    return jsonify({"msg": "Course deleted"}), 200

@app.route('/messages', methods=['GET'])
def get_messages():
    all_messages = db.session.execute(select(Message)).scalars().all()
    result = [m.serialize() for m in all_messages]

    return jsonify({
        "msg": "We get messages",
        "messages": result
    }), 200

@app.route('/messages/<int:message_id>', methods=['GET'])
def get_message(message_id):
    message = db.session.execute(
        select(Message).where(Message.id == message_id)
    ).scalar_one_or_none()

    if message is None:
        return jsonify({"msg": "Message not found"}), 404

    return jsonify(message.serialize()), 200

@app.route('/messages', methods=['POST'])
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

@app.route('/messages/<int:message_id>', methods=['PUT'])
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

@app.route('/messages/<int:message_id>', methods=['DELETE'])
def delete_message(message_id):
    message = db.session.execute(
        select(Message).where(Message.id == message_id)
    ).scalar_one_or_none()

    if message is None:
        return jsonify({"msg": "Message not found"}), 404

    db.session.delete(message)
    db.session.commit()

    return jsonify({"msg": "Message deleted"}), 200

@app.route('/user_course', methods=['GET'])
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

@app.route('/user_course/<int:id>', methods=['GET'])
def get_user_course(id):
    user_course = User_course.query.get(id)

    if user_course is None:
        return jsonify({"msg": "User-course not found"}), 404

    response_body = {
        "msg": "This is your GET /user_course/<id> response",
        "user_course": user_course.serialize()
    }

    return jsonify(response_body), 200

@app.route('/user_course', methods=['POST'])
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

@app.route('/user_course/<int:id>', methods=['PUT'])
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

@app.route('/user_course/<int:id>', methods=['DELETE'])
def delete_user_course(id):
    user_course = User_course.query.get(id)

    if user_course is None:
        return jsonify({"error": "User-course not found"}), 404

    db.session.delete(user_course)
    db.session.commit()

    return jsonify({"msg": "User-course deleted"}), 200


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
