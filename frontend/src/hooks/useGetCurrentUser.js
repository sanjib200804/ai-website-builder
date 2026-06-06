import { useEffect } from 'react'
import axios from 'axios'
import { serverurl } from '../config'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

export default function useGetCurrentUser () {
  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${serverurl}/api/user/me`, {
          withCredentials: true
        })
        dispatch(setUserData(response.data))
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [dispatch])
}
