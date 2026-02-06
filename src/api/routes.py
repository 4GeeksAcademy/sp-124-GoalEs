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


