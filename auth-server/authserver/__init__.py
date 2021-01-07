import os

from flask import Flask
from . import blueprints

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        WTF_CSRF_SECRET_KEY=os.environ.get('WTF_CSRF_SECRET_KEY'),
        SECRET_KEY=os.environ.get('SECRET_KEY')
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.mkdir(app.instance_path)
    except OSError:
        pass

    blueprints.init_app(app)
    
    return app
