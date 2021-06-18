import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { notification } from 'antd';
import * as qs from 'qs';

//错误处理
const errorHandle = (error: AxiosError) => {
    if (axios.isCancel(error)) {
        notification.info({
            duration: 3,
            message: '请求已经取消'
        })
    } else {
        notification.error({
            duration: 3,
            message: error.message
        })
    }
};

// 用于存储目前状态为pending的请求标识信息
let pendingRequest = new Map<string, Function>();
// todo 用于根据当前请求的信息，生成请求 Key
const generateReqKey = (config: AxiosRequestConfig) => {
    const { method, url, data } = config;
    return [method, url, data].join(
        "&"
    );
}
// todo 用于把当前请求信息添加到pendingRequest对象中
const addPendingRequest = (config: AxiosRequestConfig) => {
    const requestKey = generateReqKey(config);
    config.cancelToken =
        config.cancelToken ||
        new axios.CancelToken((cancel) => {
            if (!pendingRequest.has(requestKey)) {
                pendingRequest.set(requestKey, cancel);
            }
        });
}
// todo 检查是否存在重复请求，若存在则取消已发的请求
const removePendingRequest = (config: AxiosRequestConfig) => {
    const requestKey = generateReqKey(config);
    if (pendingRequest.has(requestKey)) {
        const cancel = pendingRequest.get(requestKey);
        cancel && cancel(requestKey);
        pendingRequest.delete(requestKey);
    }
}
// todo 切换页面时取消所有pending 中的请求
const cancelAllRequest = () => {
    if (pendingRequest.size === 0) return;
    for (let [key, cancel] of pendingRequest) {
        cancel();
    }
}
//创建axios实例
var instance = axios.create({
    withCredentials: true, // 允许跨域
    timeout: 5000, // 超时设置
});

//设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

//请求拦截器
instance.interceptors.request.use(
    (config) => {
        removePendingRequest(config); // 检查是否存在重复请求，若存在则取消已发的请求
        addPendingRequest(config); // 把当前请求添加到pendingRequest对象中
        // 设置 token
        // const token = store.state.token;
        // token && (config.headers.Authorization = token);
        return config;
    },
    (error) => Promise.reject(error),
);
//响应拦截器
instance.interceptors.response.use(
    (res: AxiosResponse) => {
        removePendingRequest(res.config); // 从pendingRequest对象中移除请求
        if (Number(res.data.code) === 200) {
            return Promise.resolve(res);
        } else {
            notification.error({
                duration: 3,
                message: res.data.message
            })
            // TODO 这里还可以添加自定义方法
            return Promise.reject(res);
        }
    },
    (error: AxiosError) => {
        removePendingRequest(error.config || {}); // 从pendingRequest对象中移除请求
        errorHandle(error);
        return Promise.reject(error);
    },
);

/**
 * @param {String} url -- 接口
 * @param {Object} data -- 所有请求参数都穿对象字面量
 * @param {String} type -- 默认是get请求
 * @author: Jason
 */
const http = (url: string, data: any = {}, type = 'GET') => {
    if (type === 'GET') {
        if (JSON.stringify(data) === '{}') {
            return instance.get(url);
        }
        let paramStr = '';
        Object.keys(data).forEach((key) => {
            paramStr += `${key}=${data[key]}&`;
        });
        if (paramStr) {
            paramStr = paramStr.substring(0, paramStr.length - 1);
        }
        // 使用ajax发送get请求
        return instance.get(`${url}?${paramStr}`);
    }
    const body = qs.stringify(data);
    // 使用ajax发送post请求
    return instance.post(url, body);
};

export {
    http,
    cancelAllRequest
};

