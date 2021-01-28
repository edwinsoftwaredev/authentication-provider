from flask import Flask
from flask_wtf.csrf import CSRFProtect
from . import auth, csrf_token, clients

def init_app(app: Flask):
    csrf = CSRFProtect(app)
    app.register_blueprint(auth.bp)
    app.register_blueprint(csrf_token.bp)
    app.register_blueprint(clients.bp)

    # This bp does not have csrf protection.
    # It is not required because it generates
    # the csrf token.
    csrf.exempt(csrf_token.bp)