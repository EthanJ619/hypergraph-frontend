import axios from 'axios'
import { Message } from 'element-ui'
import router from '../router'

axios.defaults.baseURL = '/api'
// axios.defaults.baseURL = '/software6/api'  //山东部署


// 请求拦截器
// axios.interceptors.request.use(config => {
// config.headers = { 'Content-Type':'multipart/form-data' }
// 如果存在 token，请求携带这个 token( 登录的时候 把 token 存入了 sessionStorage ）
// if (window.sessionStorage.getItem("tokenStr")) {
// token 的key : Authorization ; value: tokenStr
//         config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr')
//     }
//     return config;
// },error => {
//     console.log(error)
// })

//响应拦截器
axios.interceptors.response.use(res => {
    if (res.status && res.status == 200) {
        if (res.data.code == 200) {
            Message.success({ message: res.data.message });
        }
        /* else if (res.data.code == 500 || res.data.code == 403) {
            Message.error({ message: res.data.message });
            // return;
        } */
        else if (res.data.message) {
            Message.info({ message: res.data.message });
        }
    }
    return res.data;
}, error => {
    if (error.response.code == 504 || error.response.code == 404) {
        Message.error({ message: '找不到服务器了' });
    }
    else if (error.response.code == 403) {
        Message.error({ message: '权限不足，请联系管理员' });
    }
    else if (error.response.code == 401) {
        Message.error({ message: '尚未登陆，请登录' });
        router.replace('/');
    }
    // else{
    //     if(error.response.data.message){
    //         Message.error({message:error.response.data.message});
    //     }else{
    //         Message.error({message:'未知错误'})
    //     }
    // }
    return;
})
let base = '';
export const postRequest = (url, params, contentType) => {

    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
}

// 传送 json 格式的 get 请求
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
}

// 传送 json 格式的 put 请求
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
}

// 传送 json 格式的 delete 请求
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
}

// export const uploadFile = (url, formData, file) => {
//     return axios({
//         method: "post",
//         url: `${base}${url}`,
//         formData: formData,
//         tableFile: file
//     })
// }
