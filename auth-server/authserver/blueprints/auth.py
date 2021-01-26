import logging
import os

from flask import Blueprint, request, abort
from ory_hydra_client.api.admin_api import AdminApi
from ory_hydra_client.rest import ApiException
import ory_hydra_client
import requests
from requests.exceptions import Timeout
from werkzeug.utils import redirect


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
        # if remember is not set loging out may not work as expected!!!
        body = ory_hydra_client.AcceptLoginRequest(
            subject=subject,
            remember=True,
            remember_for=3600)
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
                return reject_login_request(api_instance, login_challenge)
            elif (res_whoami.json() and 
                'active' in res_whoami.json() and
                res_whoami.json()['active'] is True):

                subject = res_whoami.json()['identity']['id']
                return accept_login_request(api_instance, login_challenge, subject)

            else:
                return reject_login_request(api_instance, login_challenge)
    except KeyError:
        logging.error('There was an error when trying to get value by key.')
        abort(400)
    except ApiException:
        logging.error('An ApiException occurred.')
        abort(400)


@bp.route('/consent-challenge', methods=['GET'])
def get_consent_request():
    def reject_consent_challenge(api_instance: AdminApi, consent_challenge: str):
        body=ory_hydra_client.RejectRequest()
        api_response=api_instance.reject_consent_request(consent_challenge, body=body)
        return {'redirectUrl': api_response.redirect_to}

    def accept_consent_challenge(api_instance: AdminApi, consent_challenge: str, requested_scope):
        body=ory_hydra_client.AcceptConsentRequest(
            grant_scope=requested_scope,
            remember=True,
            remember_for=3600)
        api_response = api_instance.accept_consent_request(consent_challenge, body=body)
        return {'redirectUrl': api_response.redirect_to}

    configuration = ory_hydra_client.Configuration(
        os.environ.get('HYDRA_ADMIN_SERVER')
    )

    try:
        consent_challenge = request.args.get('consent_challenge')
        if not consent_challenge:
            abort(400)
        
        with ory_hydra_client.ApiClient(configuration) as api_client:
            api_instance = ory_hydra_client.AdminApi(api_client)
            api_response = api_instance.get_consent_request(consent_challenge)

            if api_response.skip:
                kratos_url=os.environ.get('KRATOS_SERVER')
                res_whoami=requests.get(f'{kratos_url}/sessions/whoami', cookies=request.cookies)

                if res_whoami.status_code == 401:
                    return reject_consent_challenge(api_instance, consent_challenge)
                elif (res_whoami.json() and 
                    'active' in res_whoami.json() and
                    res_whoami.json()['active'] is True):

                    requested_scope = api_response.requested_scope
                    return accept_consent_challenge(api_instance, consent_challenge, requested_scope)
                else:
                    return reject_consent_challenge(api_instance, consent_challenge)

            if not api_response.skip:
                response = {
                    'client': api_response.client.client_name,
                    'challenge': api_response.challenge,
                    'requested_scope': api_response.requested_scope,
                    'user': api_response.subject
                }
                return response


    except ValueError:
        logging.error('It was not possible to retrive the value with the given key')
    except Exception:
        logging.error('There was an error in get_consent_request')


@bp.route('/consent-challenge', methods=['POST'])
def consent_challenge():
    def reject_consent_challenge(api_instance: AdminApi, consent_challenge: str):
        body=ory_hydra_client.RejectRequest()
        api_response=api_instance.reject_consent_request(consent_challenge, body=body)
        return {'redirectUrl': api_response.redirect_to}

    def accept_consent_challenge(api_instance: AdminApi, consent_challenge: str, requested_scope):
        body = ory_hydra_client.AcceptConsentRequest(
            grant_scope=requested_scope,
            remember=True,
            remember_for=3600)
        api_response = api_instance.accept_consent_request(consent_challenge, body=body)
        return {'redirectUrl': api_response.redirect_to}

    req_json=request.get_json()
    configuration=ory_hydra_client.Configuration(
        os.environ.get('HYDRA_ADMIN_SERVER')
    )

    try:
        consent_challenge=req_json['consentChallenge']

        if not consent_challenge:
            abort(400)

        with ory_hydra_client.ApiClient(configuration) as api_client:
            api_instance=ory_hydra_client.AdminApi(api_client)
            api_response=api_instance.get_consent_request(consent_challenge)
            kratos_url=os.environ.get('KRATOS_SERVER')
            res_whoami=requests.get(f'{kratos_url}/sessions/whoami', cookies=request.cookies)

            if res_whoami.status_code == 401:
                return reject_consent_challenge(api_instance, consent_challenge)
            elif (res_whoami.json() and 
                'active' in res_whoami.json() and
                res_whoami.json()['active'] is True):

                requested_scope=api_response.requested_scope
                return accept_consent_challenge(api_instance, consent_challenge, requested_scope)
            else:
                return reject_consent_challenge(api_instance, consent_challenge)

    except KeyError:
        logging.error(f'There was an error when getting value by key in request body')
    except ApiException as api_exception:
        logging.error(f'An ApiException occured: {api_exception.reason}')

@bp.route('/reject-consent-challenge', methods=['POST'])
def rjct_consent_challenge(): 
    def reject_consent_challenge(api_instance: AdminApi, consent_challenge: str):
        body=ory_hydra_client.RejectRequest()
        api_response=api_instance.reject_consent_request(consent_challenge, body=body)
        return {'redirectUrl': api_response.redirect_to}

    configuration=ory_hydra_client.Configuration(
        os.environ.get('HYDRA_ADMIN_SERVER')
    )

    try:
        consent_challenge=request.get_json()['consentChallenge']

        if not consent_challenge:
            abort(400)

        with ory_hydra_client.ApiClient(configuration) as api_client:
            api_instance = ory_hydra_client.AdminApi(api_client)
            return reject_consent_challenge(api_instance, consent_challenge)

    except KeyError:
        logging.error(f'There was an error when getting value by key in request body')
    except ApiException as api_exception:
        logging.error(f'An ApiException occurred: {api_exception.reason}')


@bp.route('/logout-challenge', methods=['POST'])
def logout_challenge():
    req_json=request.get_json()
    configuration=ory_hydra_client.Configuration(
        os.environ.get('HYDRA_ADMIN_SERVER')
    )

    try:
        logout_challenge=req_json['logoutChallenge']

        if not logout_challenge:
            abort(401)

        with ory_hydra_client.ApiClient(configuration) as api_client:
            api_instance=ory_hydra_client.AdminApi(api_client)
            api_response=api_instance.accept_logout_request(logout_challenge)
            return {'redirectUrl': api_response.redirect_to}

    except KeyError:
        logging.error('There was an error when getting value by key in request body')
    except ApiException as api_exception:
        logging.error(f'An ApiException occurred: {api_exception.reason}')


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
