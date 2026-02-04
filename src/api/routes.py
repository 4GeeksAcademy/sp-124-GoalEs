"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api, resources={r"/*": {"origins": "https://congenial-goldfish-g95wxr6979qfpv44-3000.app.github.dev"}})



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "FUNCIONA LA CONEXION BACK CON FRONTEND"
    }

    return jsonify(response_body), 200
