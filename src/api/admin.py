import os
import inspect
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from .models import db
from . import models


class DefaultAdmin(ModelView):
    column_display_pk = True


_admin_instance = None               #in variable baraye ine ke admin ro dobar register nakonim


def setup_admin(app):
    global _admin_instance           # global mikonim ta betoonim check konim admin ghablan sakhte shode ya na
    if _admin_instance is not None:  # agar admin already sakhte shode, dobar nasaz
        return                       #jeloye register dobare ro migire

    app.secret_key = os.environ.get("FLASK_APP_KEY", "sample key")

    _admin_instance = Admin(         # be jaye local admin, az instance global estefade mikonim
        app,
        name="4Geeks Admin",
        url="/admin",                # URL ro explicit mikonim (default ham hamine vali shafaf beshe)
        endpoint="admin_panel"     # endpoint yektA ta conflict blueprint 'admin' pish nayad
    )

    for name, obj in inspect.getmembers(models):
        if (
            inspect.isclass(obj)
            and issubclass(obj, db.Model)
            and obj is not db.Model
        ):
            _admin_instance.add_view(  # add_view ro rooye _admin_instance mizanim na admin local
                DefaultAdmin(
                    obj,
                    db.session,
                    endpoint=f"admin_{obj.__tablename__}",  # har model endpoint khodesh ro dare -> conflict nemishe
                    name=obj.__tablename__                  # name ro tablename mizarim ke admin UI ghabele khundan bashe
                )
            )