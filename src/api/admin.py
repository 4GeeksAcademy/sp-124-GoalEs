import os
import inspect
from flask_admin import Admin
from . import models
from .models import db, User
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme

class UserAdmin(ModelView):
        column_list = ("id", "name", "surname", "email")

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin', theme=Bootstrap4Theme(swatch='cerulean'))

    # Dynamically add all models to the admin interface
    for name, obj in inspect.getmembers(models):
        # Verify that the object is a SQLAlchemy model before adding it to the admin. 
        if inspect.isclass(obj) and issubclass(obj, db.Model):
            admin.add_view(UserAdmin(User, db.session))