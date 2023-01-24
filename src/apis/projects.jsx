import axios from 'axios'
import { ENDPOINT } from '../configs'

const projectEndpoint = `${ENDPOINT}/projects`
const localEndpoint = `${ENDPOINT}/sign`
const sNodesEndpoint = `${ENDPOINT}/snodes`
const createProjectEndpoint = `${ENDPOINT}/create-project`
const getAllUserProjects =  `${ENDPOINT}/user-projects`

const projectApi = {
  createProject: (param, userid) => axios({
    method: 'post',
    url: `${createProjectEndpoint}/${userid}`, 
    data: param
  }),
  // createProject: (param) => axios.post(projectEndpoint, param),
  verifySignature: (param) => axios.get(`${localEndpoint}?signature=${param.signature}&wallet=${param.wallet}`),
  getProjectStats: (param) =>
    axios({
      method: 'post',
      url: projectEndpoint + '/' + param.projectId,
      headers: {
        'Api-Key': param.apiKey
      },
      data: {
        "id": 1,
        "method": "get_project_stats",
        "params": []
      }
    }),
  getSNodes: () => axios.get(sNodesEndpoint),
  getAllProjects: (userid) => axios.get(`${getAllUserProjects}/${userid}`),
}

export default projectApi