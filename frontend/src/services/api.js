import axios from 'axios'

const api = axios.create({
    baseURL: 'http://192.168.100.22:3333'
    // baseURL: 'http://192.168.100.50:3333'
    // baseURL: 'https://pet-radar.herokuapp.com/'
})

export default api