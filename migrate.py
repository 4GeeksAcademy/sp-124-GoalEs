#!/usr/bin/env python
"""
Direct database upgrade script that bypasses the admin import issue
"""
from app import app
from flask_migrate import upgrade
import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Now we can import Flask-Migrate and the app

# Temporarily mock flask_admin to avoid the jinja2 compatibility issue
sys.modules['flask_admin'] = type(sys)('flask_admin')
sys.modules['flask_admin.base'] = type(sys)('flask_admin.base')
sys.modules['flask_admin.contrib'] = type(sys)('flask_admin.contrib')
sys.modules['flask_admin.contrib.sqla'] = type(sys)('flask_admin.contrib.sqla')
sys.modules['flask_admin.contrib.sqla.view'] = type(
    sys)('flask_admin.contrib.sqla.view')
sys.modules['flask_admin.theme'] = type(sys)('flask_admin.theme')

# Now we can import the app


def apply_migrations():
    """Apply all pending database migrations."""
    with app.app_context():
        try:
            print("🔄 Applying database migrations...")
            upgrade()
            print("✅ Migrations applied successfully!")
            return True
        except Exception as e:
            print(f"❌ Error applying migrations: {e}")
            import traceback
            traceback.print_exc()
            return False


if __name__ == '__main__':
    success = apply_migrations()
    sys.exit(0 if success else 1)
