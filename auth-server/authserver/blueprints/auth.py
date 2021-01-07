from flask import Blueprint
from flask_cors import CORS

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/challenge', methods=['POST'])
def login_challenge():
    return 'It Works'
