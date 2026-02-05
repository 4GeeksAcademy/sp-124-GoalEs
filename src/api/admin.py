import os
import inspect
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_admin.theme import Bootstrap4Theme

from .models import db
from . import models


class DefaultAdmin(ModelView):
    column_display_pk = True


def setup_admin(app):
    app.secret_key = os.environ.get("FLASK_APP_KEY", "sample key")

    admin = Admin(
        app,
        name="4Geeks Admin",
        theme=Bootstrap4Theme(swatch="cerulean")
    )

    for name, obj in inspect.getmembers(models):
        if (
            inspect.isclass(obj)
            and issubclass(obj, db.Model)
            and obj is not db.Model
        ):
            admin.add_view(DefaultAdmin(obj, db.session))
