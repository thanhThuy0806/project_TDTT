<<<<<<< HEAD
from typing import cast  # Thêm import này
from firebase_admin import firestore
from google.cloud.firestore_v1.base_document import DocumentSnapshot
=======
from firebase_admin import firestore
>>>>>>> BE_Warning
from app.config.firebase import init_firebase_admin

init_firebase_admin()
db = firestore.client()

def get_user_profile(uid: str):
<<<<<<< HEAD
    doc_ref = db.collection("user-info").document(uid)

    doc = cast(DocumentSnapshot, doc_ref.get())
=======
    doc_ref = (
        db.collection("user-info")
        .document(uid)
    )

    doc = doc_ref.get()
>>>>>>> BE_Warning

    if not doc.exists:
        return None

    return doc.to_dict()