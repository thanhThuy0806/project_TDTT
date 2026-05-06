import firebase_admin
from firebase_admin import credentials, auth

cred = credentials.Certificate("firebase-key.json")
firebase_admin.initialize_app(cred)

def verify_token(token):
    decoded = auth.verify_id_token(token)
    return decoded