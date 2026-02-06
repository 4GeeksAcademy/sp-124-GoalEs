#!/usr/bin/env python
"""
Helper script to apply database migrations.
Run this with: pipenv run python apply_migrations.py
"""
from flask_migrate import upgrade
from app import app
import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))


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
            return False


if __name__ == '__main__':
    success = apply_migrations()
    sys.exit(0 if success else 1)
