import axios from 'axios';
import {message} from "antd";

export default function ajax(url,data,method) {
  let reqParams = data;
  method = method.toLowerCase();
  if (method === "get"){
    reqParams ={ params:data }
  }
   return axios[method](url,reqParams)
    .then((res)=>{
      const { data } = res;
      if(data.status === 0){
        return data
      }else {
        message.error(data.msg);
      }
    })
    .catch(()=>{
      message.error('网络异常，请刷新重试');
    })
}