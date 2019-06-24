import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';

export function reqLogin(username, password) {
  return ajax('/login',{username,password},'post')
}

export function reqValidatorUser(id) {
  return ajax('/validator/user',{id},'post')
}

export function getWeather() {
  return new Promise((resolve)=>{
    jsonp('http://api.map.baidu.com/telematics/v3/weather?location=深圳&output=json&ak=3p49MVra6urFRGOT9s8UBWr2',{},(err,res)=>{
      if (!err){
        const { weather,dayPictureUrl } = res.results[0].weather_data[0];
        resolve({ weather, weatherImg:dayPictureUrl })
      }else {
        message.error("天气获取失败~请刷新重试~");
        resolve();
      }
    })
  });
}