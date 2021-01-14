import logging
import os

from flask import Blueprint, request, abort, redirect, jsonify
from ory_hydra_client.api.admin_api import AdminApi
from ory_hydra_client.models.login_request import LoginRequest
from ory_hydra_client.rest import ApiException
import ory_hydra_client
import requests
from requests.exceptions import Timeout


bp = Blueprint('auth', __name__, url_prefix='/api/auth')


# with this functionality user must be always authenticated to be able to access apis


@bp.route('/login-challenge', methods=['POST'])
def login_challenge():
    def reject_login_request(api_instance: AdminApi, login_challenge):
        # this function has to be tested
        body = ory_hydra_client.RejectRequest()
        api_response = api_instance.reject_login_request(login_challenge, body=body)
        return {'redirectUrl': api_response.redirect_to}

    def accept_login_request(api_instance: AdminApi, login_challenge, subject):
        # subject must be equal to the user's id genereted by ory kratos
        body = ory_hydra_client.AcceptLoginRequest(subject=subject)
        api_response = api_instance.accept_login_request(login_challenge, body=body)
        return {'redirectUrl': api_response.redirect_to}

    req_json = request.get_json()
    configuration = ory_hydra_client.Configuration(
        os.environ.get('HYDRA_ADMIN_SERVER')
    )

    try:
        login_challenge=req_json['loginChallenge']
        if not login_challenge:
            abort(400)

        with ory_hydra_client.ApiClient(configuration) as api_client:
            api_instance = ory_hydra_client.AdminApi(api_client)
            # the response has the property skip. 
            # further information is in the documentation
            # response: LoginRequest = api_instance.get_login_request(login_challenge)
            kratos_url = os.environ.get('KRATOS_SERVER')
            res_whoami = requests.get(f'{kratos_url}/sessions/whoami', cookies=request.cookies)

            if res_whoami.status_code == 401:
                reject_login_request(api_instance, login_challenge)
                abort(401)
            elif (res_whoami.json() and 
                'active' in res_whoami.json() and
                res_whoami.json()['active'] is True):

                subject = res_whoami.json()['identity']['id']
                return accept_login_request(api_instance, login_challenge, subject)

            else:
                reject_login_request(api_instance, login_challenge)
                abort(401)
    except KeyError:
        logging.error('There was an error when trying to get value by key.')
        abort(400)
    except ApiException:
        logging.error('An ApiException occurred.')
        abort(400)


@bp.route('/consent-challenge', methods=['POST'])
def consent_challenge():
    def reject_consent_challenge():
        pass

    def accept_consent_challenge():
        pass

    req_json=request.get_json()
    try:
        consent_challenge=req_json['consentChallenge']

        if not consent_challenge:
            abort(400)

        
    except KeyError as key_error:
        logging.error(f'There was an error when getting value by key in request body')
    except ApiException as api_exception:
        logging.error(f'An ApiException occured: {api_exception.reason}')


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
