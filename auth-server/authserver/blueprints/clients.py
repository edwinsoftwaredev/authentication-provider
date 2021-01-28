import os
from flask import Blueprint, g, abort
from flask.json import jsonify
import requests
from ..decorators.auth import login_required

bp=Blueprint('clients', __name__, url_prefix='/api/clients')

@bp.route('/my-clients', methods=['GET'])
@login_required
def my_clients():
    user_id=g.user['identity']['id']
    hydra_url=os.environ.get('HYDRA_ADMIN_SERVER')
    offset=1
    clients=[]

    while True:
        response=requests.get(f'{hydra_url}/clients',
            params={
                'limit':100,
                'offset': offset
            }
        ) 

        offset+=101

        if response.status_code!=200:
            abort(500)

        for client in response.json():
            if client['owner']==user_id:
                clients.append(client)

        if len(response.json())==0:
            break

    return jsonify(clients)
