import axios from 'axios'
import { ENDPOINT } from '../configs'

const createUserEndpoint = `${ENDPOINT}/create-user`

const userApi = {
  createUser: (param) => axios.post(createUserEndpoint, param)
}

export default userApi