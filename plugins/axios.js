import axios from 'axios'

var Hjson = require('hjson')
import config from '../fluis.config.hjson'
config = Hjson.parse(config)

export default axios.create({
    baseURL: config.baseURL,
    headers: {
    'Content-Type': 'text/plain;charset=utf-8'
    }
})