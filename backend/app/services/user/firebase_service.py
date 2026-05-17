from typing import cast  # Thêm import này
from firebase_admin import firestore
from google.cloud.firestore_v1.base_document import DocumentSnapshot
from app.config.firebase import init_firebase_admin

init_firebase_admin()
db = firestore.client()

def get_user_profile(uid: str):
    doc_ref = db.collection("user-info").document(uid)

    doc = cast(DocumentSnapshot, doc_ref.get())

    if not doc.exists:
        return None

    return doc.to_dict()