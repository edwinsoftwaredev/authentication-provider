from flask import Flask
from flask_wtf.csrf import CSRFProtect
from . import auth, csrf_token

def init_app(app: Flask):
    csrf = CSRFProtect(app)
    app.register_blueprint(auth.bp)
    app.register_blueprint(csrf_token.bp)
    csrf.exempt(csrf_token.bp)