"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import select
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#Started my code from here - GET

@api.route('/users', methods=['GET'])
def get_users():

    all_user = db.session.execute(select(User)).scalars().all()
    result = [u.serialize() for u in all_user]

    return jsonify(result), 200

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
