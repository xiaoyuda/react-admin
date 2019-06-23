import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import PropTypes from 'prop-types';
import { Link, withRouter } from "react-router-dom";
import menuList from '../../config/menu-config';

import './index.less';
import logo from '../../assets/images/logo.png'

const { SubMenu } = Menu;

class LeftMenu extends Component {
  static propTypes = {
    collapsed:PropTypes.bool.isRequired
  };



  componentWillMount() {
  //处理菜单的个性化问题，根据用户的不同决定菜单显示的内容
    //定义函数封装菜单展开的功能
   const getMenu=(item)=>{
     return <Menu.Item key={item.key}>
       <Link to={item.key}>
         <Icon type={item.icon} />
         <span>{item.title}</span>
       </Link>
     </Menu.Item>
   };

   this.menus =menuList.map((menu)=>{
      if (menu.children){
        return <SubMenu
          key={menu.key}
          title={
            <span>
                  <Icon type={menu.icon} />
                  <span>{menu.title}</span>
                </span>
          }
        >
          {
            menu.children.map((item)=>{
              return getMenu(item)
            })
          }
        </SubMenu>
      } else {
        return getMenu(menu);
      }
    })


    //处理默认选中的问题
    //首先获取当前页面的路径//注意：当前页面不是路由组件，所以是没有路由属性的，要通过withRouter传递
    const { pathname } = this.props.location;
    this.selectedKeys = pathname;
  }

  render() {
    const { collapsed } = this.props;
    return (
      <div className="left-side">
        <div className="left-header-logo">
          <img src={logo} alt="logo"/>
          <h2 style={{display:collapsed?'none':'block'}}>硅谷后台</h2>
        </div>
        <Menu theme="dark" defaultSelectedKeys={this.selectedKeys}  defaultOpenKeys mode="inline">
          {this.menus}
        </Menu>
      </div>
    )
  }
}

//调用完withRouter  整个组件才能拿到路由属性
export default withRouter(LeftMenu);