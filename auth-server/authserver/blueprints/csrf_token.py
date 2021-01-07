from flask import Blueprint
from flask.helpers import make_response
from flask.json import jsonify
from flask.wrappers import Response
from flask_cors import CORS
from flask_wtf.csrf import generate_csrf

bp = Blueprint('csrf_token', __name__, url_prefix='/api/auth')

@bp.route('/csrf-token', methods=['GET'])
def get_token():
    return make_response('', 204)


@bp.after_request
def inject_csrf_token(response: Response):
    response.set_cookie('auth-csrf-token', value=generate_csrf())
    return response