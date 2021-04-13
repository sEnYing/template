import axios from "../index.js";

const getHead = (data)=>{
    return axios.get('/list/tabel/head',data)
}

export default {
    getHead
}