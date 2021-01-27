import os
from ory_keto_client.exceptions import ApiException as KetoApiException
import requests
from requests.exceptions import ConnectionError, Timeout

from flask import Flask
from flask_cors.extension import CORS
from . import blueprints
import ory_keto_client
import ory_kratos_client
from ory_kratos_client.exceptions import ApiException as KratosApiException

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
    
    create_client(app.logger)
    create_admin_user(app.logger)
    return app

###########################################################################################
def create_admin_user(logger):
    logger.info('Creating admin user')
    configuration = ory_kratos_client.Configuration(
        host=os.environ.get('KRATOS_ADMIN_URL')
    )

    with ory_kratos_client.ApiClient(configuration) as api_client:
        api_instance=ory_kratos_client.AdminApi(api_client)
        body=ory_kratos_client.CreateIdentity(
            schema_id=os.environ.get('USER_KRATOS_SCHEMA'),
            traits={
                'username':os.environ.get('ADMIN_USER'),
                'email':os.environ.get('ADMIN_EMAIL'),
                'name':os.environ.get('ADMIN_NAME')
            }
        )

        try:
            api_response=api_instance.create_identity(body=body)
            role = upsert_role(logger ,[api_response.id], 'SystemAdministrators')
            acp = upsert_oacp(
                logger,
                [role.id],
                ['administration:system'],
                'System Adminitration Policy',
                'AdministrationSystem',
                'allow'
            )

        except KratosApiException as e:
            if e.status == 409:
                logger.info('Admin user was not created because it already exists.')
            else:
                logger.error(f'Exception when calling AdminApi->create_identity: {e}')


def upsert_oacp(
    logger,
    role_ids: list[str], 
    resources: list[str], 
    desc: str, 
    id: str, 
    effect: str):
    # id might be something like: AdministratorsSystem
    logger.info('Creating admin user policy.')
    configuration = ory_keto_client.Configuration(
        host=os.environ.get('ORY_KETO_URL')
    )

    with ory_keto_client.ApiClient(configuration) as api_client:
        api_instance=ory_keto_client.EnginesApi(api_client)
        flavor='exact'
        body=ory_keto_client.OryAccessControlPolicy(
            subjects=role_ids,
            resources=resources,
            description=desc,
            id=id,
            effect=effect
        )

        try:
            api_response=api_instance.upsert_ory_access_control_policy(flavor, body=body)
            return api_response
        except KetoApiException as e:
            logger.error(f'Exception when calling EnginesApi->upsert_ory_access_control_policy: {e.reason}')


def upsert_role(logger, members: list[str], id: str):
    # id might be something like: SystemAdministrators
    logger.info('Creating admin user role.')
    configuration=ory_keto_client.Configuration(
        host=os.environ.get('ORY_KETO_URL')
    )

    with ory_keto_client.ApiClient(configuration) as api_client:
        api_instance=ory_keto_client.EnginesApi(api_client)
        flavor='exact'
        body=ory_keto_client.OryAccessControlPolicyRole(id=id, members=members)

        try:
            api_response=api_instance.upsert_ory_access_control_policy_role(flavor, body=body)
            return api_response
        except KetoApiException as e:
            logger.error(f'Exception when calling EnginesApi->upsert_ory_access_control_policy_role: {e.reason}')
        
###########################################################################################

def create_client(logger):
    logger.info('Creating client demo.')
    try:
        url = os.environ.get('HYDRA_ADMIN_SERVER')
        r = requests.get(f'{url}/health/alive', timeout=5)
        if r.status_code == 200:
            rg = requests.get(f'{url}/clients')

            if rg.json() and rg.json()[0]['client_id'] == 'ClientDemo':
                logger.info('Client demo was not created because it already exists.')
                return

            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

            # auth-server doesn't have to have any reference to any client in code
            # this is just because this is a client seed to test the functionality
            # of this project 
            auth_client=os.environ.get('CLIENT_URL')
            post_logout_redirect_url = f'{auth_client}/auth/logout'

            data = {
                'client_id': 'ClientDemo',
                'client_name': 'ClientDemo',
                'grant_types': ['authorization_code'],
                # check docs https://www.ory.sh/hydra/docs/guides/oauth2-public-spa-mobile
                'token_endpoint_auth_method': 'none', 
                'response_types': ['code'],
                'scope': 'openid profile',
                'post_logout_redirect_uris': [post_logout_redirect_url],
                'redirect_uris': [f'{auth_client}/auth/codes'],
                'allowed_cors_origins': [os.environ.get('CLIENT_URL')]
            }

            rp = requests.post(
                f'{url}/clients',
                json=data,
                headers=headers
            )

            if rp.status_code == 201:
                logger.info('Client created.')
        
    except ConnectionError:
        logger.error('Hydra server is unreachable.')
    except Timeout:
        logger.error('Hydra did not return a response.')

