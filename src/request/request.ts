/**
 *   @Project:   axios请求封装
 *   @Author:    Zi_Jun
 *   @Email:     zijun2030@gmail.com
 *   @Date:      2019/9/18 10:49
 *   @Note:
 */

import axios from "axios";
// @ts-ignore
import QS from "qs";
import { Toast } from "vant";
import router from "../router";
import store from "@/store";

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 * @param msg {string} 错误提示信息
 * @return
 */
const tip = (msg: string) => {
  Toast({
    message: msg,
    duration: 1000,
    forbidClick: true
  });
};

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};

/**
 * 请求失败后的错误统一处理
 * @param status {Number} 请求失败的状态码
 * @param msg {String} 请求失败信息
 */
const errorHandle = (status: number, msg: string) => {
  // 状态码判断
  // 401 未登录,跳转登录页
  // 403 token过期,清除token并跳转登录页
  // 404 请求不存在
  const CODE_401 = 401;
  const CODE_403 = 403;
  const CODE_404 = 404;
  switch (status) {
    case CODE_401:
      toLogin();
      break;
    case CODE_403:
      tip("登录过期，请重新登录");
      localStorage.removeItem("token");
      store.commit("loginSuccess", null);
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
    case CODE_404:
      tip("请求的资源不存在");
      break;
    default:
      tip(msg);
  }
};

const service = axios.create({
  baseURL: process.env.BASE_URL,
  timeout: 1000 * 12
});

// request拦截器
service.interceptors.request.use(
  (config: any) => {
    // 注入请求权限信息
    config.headers.authKey = localStorage.get("authKey");
    config.headers.sessionId = localStorage.get("sessionId");

    if (!config.headers["Content-Type"] || config.headers["Content-Type"].indexOf("multipart/form-data") === -1) {
      config.data = QS.stringify(config.data);
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// response拦截器
service.interceptors.response.use(
  // 200 服务器状态码,接口请求成功,可以正常拿到数据
  response => (response.status === 200 ? Promise.resolve(response) : Promise.reject(response)),
  // !200 服务器状态码不是200的情况
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      store.commit("changeNetwork", false);
    }
  }
);

export default service;
