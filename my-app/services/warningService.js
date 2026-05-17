import { auth } from '@/firebase/firebaseConfig'
import { API_URL } from '@/constants/api'
import api from 'axios'

export const getSafetyDetail = async (lat, lng) => {
    const currentUser = auth.currentUser
    if (!currentUser) {
        throw new Error("Inaccessible due to user did not log in")
    }

    const token = await currentUser.getIdToken()
    const res = await api.post(
        `http://${API_URL}:8000/warning/check-danger`, 
        {
            lat: lat,
            lng: lng,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data
}
export const checkSaftetyDetail = async(place) => {
    const currentUser = auth.currentUser
    if (!currentUser) {
        throw new Error("Inaccessible due to user did not log in")
    }

    const token = await currentUser.getIdToken()
    const res = await api.post(
        `http://${API_URL}:8000/warning/check-place`, 
        {
            place: place
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res.data
}