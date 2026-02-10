"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User, Coach, Course, UserCourseFavorite
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS
from sqlalchemy import select



# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../dist/')
app = Flask(__name__)
app.url_map.strict_slashes = False

CORS(app)


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

    if user_update is None:
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


@app.route("/course/<int:id>", methods=["PUT"])
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


@app.route("/course/<int:id>", methods=["DELETE"])
def delete_course(id):
    course = db.session.execute(
        select(Course).where(Course.id == id)
    ).scalar_one_or_none()

    if not course:
        return jsonify({"error": "Course not found"}), 404

    db.session.delete(course)
    db.session.commit()
    return jsonify({"msg": "Course deleted"}), 200


@app.route("/users/<int:user_id>/favorites/<int:course_id>", methods=["POST"])
def add_favorite(user_id, course_id):

    exists = UserCourseFavorite.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

    if exists:
        return jsonify({"error": "Already favorite"}), 400

    fav = UserCourseFavorite(
        user_id=user_id,
        course_id=course_id
    )

    db.session.add(fav)
    db.session.commit()

    return jsonify(fav.serialize()), 201


@app.route("/users/<int:user_id>/favorites", methods=["GET"])
def get_user_favorites(user_id):

    favorites = UserCourseFavorite.query.filter_by(user_id=user_id).all()

    results = []
    for fav in favorites:
        course = Course.query.get(fav.course_id)
        results.append({
            "id": fav.id,
            "course": course.serialize()
        })

    return jsonify({"favorites": results}), 200


@app.route("/users/<int:user_id>/favorites/<int:course_id>", methods=["DELETE"])
def remove_favorite(user_id, course_id):

    fav = UserCourseFavorite.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

    if not fav:
        return jsonify({"error": "Favorite not found"}), 404

    db.session.delete(fav)
    db.session.commit()

    return jsonify({"msg": "Favorite removed"}), 200

@app.route("/users/<int:user_id>/favorites/<int:course_id>", methods=["PUT"])
def modificar_favorite(user_id, course_id):
    favorite = UserCourseFavorite.query.filter_by(
        user_id=user_id,
        course_id=course_id
    ).first()

    if favorite:
        return jsonify({
            "msg": "Already in favorites",
            "favorite": favorite.serialize()
        }), 200

    new_favorite = UserCourseFavorite(
        user_id=user_id,
        course_id=course_id
    )

    db.session.add(new_favorite)
    db.session.commit()

    return jsonify({
        "msg": "Favorite added",
        "favorite": new_favorite.serialize()
    }), 201



# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
