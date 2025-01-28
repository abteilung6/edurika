import axios, { AxiosError } from 'axios'
import { Configuration, UsersApi, ValidationError } from 'generated-api'

const buildAxiosInstance = () => {
  const EDURIKA_API_BASE_URL = 'http://127.0.0.1:8000'
  const axiosInstance = axios.create({
    baseURL: EDURIKA_API_BASE_URL
  })

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        const axiosError = error as AxiosError
        const errorMessage = parseErrorMessage(axiosError)
        return Promise.reject(new Error(errorMessage))
      } else if (error.code === 'ERR_NETWORK') {
        return Promise.reject(new Error('Service Unavailable'))
      } else {
        return Promise.reject(error)
      }
    }
  )

  return axiosInstance
}

const configuration = new Configuration({})

const parseErrorMessage = (error: AxiosError) => {
  const errorResponse = error.response
  if (errorResponse) {
    const data = errorResponse.data
    if (typeof data === 'object' && data != null && 'detail' in data) {
      const details = data.detail
      if (typeof details === 'string') {
        return details
      }
      if (Array.isArray(details)) {
        for (const detail of details as ValidationError[]) {
          return detail.msg
        }
      }
    }
  }
  return error.message
}

export default {
  usersApi: new UsersApi(configuration, '', buildAxiosInstance())
}
