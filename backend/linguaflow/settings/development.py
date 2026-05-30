"""
LinguaFlow — Development Settings
"""
from .base import *

DEBUG = True

# Use SQLite as fallback if PostgreSQL is not available
import os
if os.environ.get('USE_SQLITE', 'False') == 'True':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Email backend for development (console)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Detailed error pages
INSTALLED_APPS += []
