import ajax from './ajax';

export function reqLogin(username, password) {
  return ajax('/login',{username,password},'post')
}