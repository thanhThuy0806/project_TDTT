import { auth } from '@/firebase/firebaseConfig'
import { API_URL } from './apiClient'
import api from 'axios'

export const getSafetyDetail = async (lat, lng) => {
    const currentUser = auth.currentUser
    if (!currentUser) {
        throw new Error("Inaccessible due to user did not log in")
    }

    console.log(`check safety detail: ${API_URL}`)
    const token = await currentUser.getIdToken(true)
    const res = await api.post(
        `http://${API_URL}/warning/check-danger`, 
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
    console.log(`check safety detail: ${API_URL}`)
    const token = await currentUser.getIdToken(true)
    const res = await api.post(
        `http://${API_URL}/warning/check-place`, 
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