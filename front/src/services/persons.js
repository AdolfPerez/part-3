import axios from 'axios'
const baseUrl = '/api/persons'

export default { 
  getAll: () => axios.get(baseUrl).then(({data}) => data), 
  create: newObject => axios.post(baseUrl, newObject).then(({data}) => data),
  update: (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject).then(({data}) => data),
  deleteOne: id => axios.delete(`${baseUrl}/${id}`)
}