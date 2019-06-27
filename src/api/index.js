import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';

export const reqLogin =(username, password) =>ajax('/login',{username,password},'post');


export const reqValidatorUser = (id) => ajax('/validator/user',{id},'post')


export const reqCategory = (parentId) => ajax('/manage/category/list',{parentId},'get')


export const addCategory = (parentId, categoryName) => ajax('/manage/category/add',{parentId, categoryName},'post');


export const reqUpdateCategoryName=(categoryId,categoryName)=> ajax('/manage/category/update',{categoryId,categoryName},'post');


export const reqProductList=(pageNum,pageSize)=> ajax('/manage/product/list',{ pageNum,pageSize },'get');

export const reqAddProduct =({name, price, desc, pCategoryId, categoryId, detail})=> ajax('/manage/product/add',{name, price, pCategoryId, desc, categoryId, detail},'post');

export const getWeather=()=> {
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
};