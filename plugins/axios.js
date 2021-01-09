import axios from 'axios'

var Hjson = require('hjson')
import config from '../fluis.config.hjson'
var c = Hjson.parse(config)

export default axios.create({
    baseURL: c.backendURL,
    headers: {
    'Content-Type': 'text/plain;charset=utf-8'
    }
})