import os
from functools import wraps
import requests
from flask import request, abort, g

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            kratos_url=os.environ.get('KRATOS_SERVER')
            response=requests.get(f'{kratos_url}/sessions/whoami', cookies=request.cookies)
            if response.status_code==401:
                abort(401)
            
            g.user=response.json()
            return f(*args, **kwargs)
        except Exception as e:
            abort(401)
    return decorated_function