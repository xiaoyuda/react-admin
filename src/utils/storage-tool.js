const USER_KEY = "USER_KEY";
const _starTime = Date.now().toString();
const USER_TIME = "USER_TIME";

export function setItem(data) {
  localStorage.setItem(USER_TIME,_starTime);
  localStorage.setItem(USER_KEY,JSON.stringify(data));
}

export function getItem() {
  //没有登陆过，值是null，相当于0，肯定会进这里
  if(Date.now() - localStorage.getItem(USER_TIME) > 1000*3600*24*7){
    removeItem();
    return {}
  }
  //如果没有登陆过，会返回null；
  return JSON.parse(localStorage.getItem(USER_KEY));
}

export function removeItem() {
  localStorage.removeItem(USER_TIME);
  localStorage.removeItem(USER_KEY);
}