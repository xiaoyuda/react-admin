import React, { Component } from 'react';
import MyButton from '../my-button';
import { getItem, removeItem } from '../../utils/storage-tool'
import { Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import { getWeather } from '../../api';
import menuList from '../../config/menu-config';

import './index.less';

class HeaderMain extends Component {
  state={
    currentTime:Date.now(),
    weather:"晴",
    weatherImg:"http://api.map.baidu.com/images/weather/day/qing.png",
  };

  logout=()=>{
    Modal.confirm({
      title:"您确认要退出吗？",
      okText:"确认",
      cancelText:"取消",
      onOk:()=>{
        removeItem();
        this.props.history.replace("/login")
      }
    })
  };

  getTitle=(props)=>{
    const { pathname } = props.location;
    for (let i = 0; i < menuList.length; i++) {
      const menu = menuList[i];
      if(menu.children){
        for (let j = 0; j < menu.children.length; j++) {
          const item = menu.children[j];
          if( item.key === pathname){
            this.title = item.title;
            return
          }
        }
      }else {
        if(menu.key === pathname){
          this.title = menu.title;
         return
        }

      }
    }
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.getTitle(nextProps);
  }

  async componentWillMount() {
    this.username = getItem().username;
    this.getTitle(this.props);
    const { promise, cancel } = getWeather();
    this.cancel =cancel;
    const { weather, weatherImg } = await promise;
    this.setState({
      weather,
      weatherImg
    })
  }

  componentDidMount() {
    this.timeId=setInterval(()=>{
      this.setState({
        currentTime:Date.now()
      })
    },1000)
  }

  componentWillUnmount() {
    clearInterval(this.timeId);
    this.cancel();
  }

  render() {
    
    const { currentTime, weather, weatherImg } =this.state;
    return <div>
      <div className="header-main-top">
        <span>欢迎，{this.username}</span>
        <MyButton onClick={this.logout}>退出</MyButton>
      </div>
      <div className="header-main-bottom">
        <span className="header-main-left">{this.title}</span>
        <div className="header-main-right">
          <span>{dayjs(currentTime).format("YYYY-MM-DD HH:mm:ss")}</span>
          <img src={weatherImg} alt="logo"/>
          <span>{weather}</span>
        </div>
      </div>
    </div>;
  }
}

export default withRouter(HeaderMain);