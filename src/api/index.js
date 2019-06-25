import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';

export function reqLogin(username, password) {
  return ajax('/login',{username,password},'post')
}

export function reqValidatorUser(id) {
  return ajax('/validator/user',{id},'post')
}

export function reqCategory(parentId) {
  return ajax('/manage/category/list',{parentId},'get')
}

export function getWeather() {
  let cancel = null;
  const promise = new Promise((resolve)=>{
    cancel = jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',{},(err,res)=>{
      if (!err){
        const { weather,dayPictureUrl } = res.results[0].weather_data[0];
        resolve({ weather, weatherImg:dayPictureUrl })
      }else {
        message.error("天气获取失败~请刷新重试~");
        resolve();
      }
    })
  });
  return {
    promise,
    cancel
  }
}