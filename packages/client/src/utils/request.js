import Axios from 'axios'

const PORT = 3000

const axios = Axios.create({
  baseURL: `http://localhost:${PORT}`,
})

function request({
  url = '/',
  method = 'post',
  data,
  params,
  header,
  onProgress = (e) => e,
}) {
  const option = {
    method,
    header,
    data,
    params,
    onUploadProgress: onProgress,
  }
  return axios(url, option)
}

export default request
