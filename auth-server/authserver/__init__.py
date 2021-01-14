import os
import requests
from requests.exceptions import ConnectionError, Timeout

from flask import Flask
from flask_cors.extension import CORS
from . import blueprints

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    # to generate truly random secrets use
    # import secrets
    # print(secrets.token_urlsafe(32))

    # to use sessions the secret_key has to be set
    # to generate csrf token sessions are required
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

    CORS(app, origins=[os.environ.get('ALLOWED_ORIGIN')], supports_credentials=True)
    blueprints.init_app(app)
    
    create_client()
    return app


def create_client():
    try:
        url = os.environ.get('HYDRA_ADMIN_SERVER')
        r = requests.get(f'{url}/health/alive', timeout=5)
        if r.status_code == 200:
            rg = requests.get(f'{url}/clients')

            if rg.json() and rg.json()[0]['client_id'] == 'ClientDemo':
                print('Client Already Exists.')
                return

            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

            auth_client = os.environ.get('ALLOWED_ORIGIN')

            data = {
                'client_id': 'ClientDemo',
                'client_name': 'ClientDemo',
                'grant_types': ['authorization_code'],
                'client_secret': os.environ.get('OAUTH_CLIENT_SECRET'),
                'response_types': ['code'],
                'scope': 'openid clientdemo.users',
                'post_logout_redirect_uris': [auth_client],
                'redirect_uris': [f'{auth_client}/auth/codes'],
                'allowed_cors_origins': [os.environ.get('CLIENT_URL')]
            }

            rp = requests.post(
                f'{url}/clients',
                json=data,
                headers=headers
            )

            if rp.status_code == 201:
                print('Client Created.')
        
    except ConnectionError:
        print('Hydra server is unreachable.')
    except Timeout:
        print('Hydra did not return a response.')

