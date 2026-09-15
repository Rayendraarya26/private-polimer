import axios from 'axios'

export const BASE_API_URL = '/api'

const api = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {}
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    config.headers['Accept'] = 'application/json'

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error) => {
    // if (error.response.status === 401) {
    //   store.dispatch(purgeAuth())
    // }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    return Promise.reject(error)
  }
)

export default api
