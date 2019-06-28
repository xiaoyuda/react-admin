import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';

export const reqLogin =(username, password) =>ajax('/login',{username,password},'post');


export const reqValidatorUser = (id) => ajax('/validator/user',{id},'post')


export const reqCategory = (parentId) => ajax('/manage/category/list',{parentId},'get');


export const addCategory = (parentId, categoryName) => ajax('/manage/category/add',{parentId, categoryName},'post');


export const reqUpdateCategoryName = (categoryId,categoryName) => ajax('/manage/category/update',{categoryId,categoryName},'post');


export const reqProductList = (pageNum,pageSize) => ajax('/manage/product/list',{ pageNum,pageSize },'get');

export const reqAddProduct = ({name, price, desc, pCategoryId, categoryId, detail}) => ajax('/manage/product/add',{name, price, pCategoryId, desc, categoryId, detail},'post');

export const reqUpdateProduct = ({name, price, desc, pCategoryId, categoryId, detail, _id}) => ajax('/manage/product/update',{name, price, pCategoryId, desc, categoryId, detail,_id},'post');

export const reqDeleImg = (id,name) => ajax('/manage/img/delete',{id,name},'post');

export const getWeather = () => {
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

export const reqSearchProductList = ({searchType, searchContent, pageNum, pageSize}) => ajax('/manage/product/search',{[searchType]:searchContent,pageNum,pageSize},'get');

export const reqRoleList = () => ajax('/manage/role/list',{},'get');

export const reqAddRole = (name) => ajax('/manage/role/add',{name},'post');

export const reqUpdateRole = (_id, auth_name, menus) => ajax('/manage/role/update',{_id, auth_name, menus},'post');

export const reqUserList = () => ajax('/manage/user/list',{},'get');