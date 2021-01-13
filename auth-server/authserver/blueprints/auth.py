import logging
import os

from flask import Blueprint, request, abort
from ory_hydra_client.models.login_request import LoginRequest
from ory_hydra_client.rest import ApiException
import ory_hydra_client
import requests
from requests.exceptions import Timeout

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/challenge', methods=['POST'])
def login_challenge():
    req_json = request.get_json()
    configuration = ory_hydra_client.Configuration(
        os.environ.get('HYDRA_ADMIN_SERVER')
    )

    try:
        login_challenge=req_json['loginChallenge']
        with ory_hydra_client.ApiClient(configuration) as api_client:
            api_instance = ory_hydra_client.AdminApi(api_client)
            response: LoginRequest = api_instance.get_login_request(login_challenge)
            client_scopes: str = response.client.scope.split(' ')
            if 'moviepolls.users' in client_scopes:
                kratos_url = os.environ.get('KRATOS_SERVER')
                res_whoami = requests.get(f'{kratos_url}/sessions/whoami', cookies=request.cookies)

                if res_whoami.status_code == 401:
                    # reject login challenge <--
                    abort(401)
                elif (res_whoami.json() and 
                    'active' in res_whoami.json() and
                    res_whoami.json()['active'] is True):

                    # this id must be equal to id genereted by ory kratos
                    body = ory_hydra_client.AcceptLoginRequest(subject=res_whoami.json()['identity']['id'])
                    # api_response = api_instance.accept_login_request(login_challenge, body=body)
                    print(body)
                else:
                    # reject login challenge <--
                    abort(401)
            else:
                # reject login challenge <--
                print('AAA')
    except KeyError:
        logging.error('There was an error when trying to get value by key.')
        abort(400)
    except ApiException:
        logging.error('An ApiException occurred.')
        abort(400)

    return 'It Works'

@bp.route('/whoami', methods=['GET'])
def whoami():
    try:
        kratos_url = os.environ.get('KRATOS_SERVER')
        # cookies are forwarded
        res = requests.get(f'{kratos_url}/sessions/whoami', cookies=request.cookies)
        
        if res.status_code == 401:
            abort(401)

        if res.json() and 'active' in res.json():
            return {'active': res.json()['active']}
        elif res.json() and 'active' not in res.json():
            abort(500)
        
    except ConnectionError:
        logging.error('Connection error when connecting with Kratos service')
        abort(500)
    except KeyError:
        logging.error('active key not found.')
        abort(500)
    except Timeout:
        logging.error('')
        abort(500)
