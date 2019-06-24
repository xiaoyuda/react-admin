import React, { Component } from 'react';
import LeftMenu from '../../cpmponents/left-menu'
import { Layout } from 'antd';
import HeaderMain from '../../cpmponents/header-main';
import { getItem } from '../../utils/storage-tool'
import { reqValidatorUser } from '../../api'

const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  async componentWillMount () {
    const user = getItem();

    //防止user被篡改为空：这样读取undefind的_id属性会报错；
    if(! user || ! user._id ){
        //看用户有没有登录过，没有登录过返回值为{}，是没有_id的；
        this.props.history.replace('/login');
      }else {
      //即便通过验证，也要向数据库发送验证的信息
        const result =await reqValidatorUser(user._id);
        if(!result){
          this.props.history.replace('/login');
        }
    }
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <LeftMenu collapsed={this.state.collapsed}/>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 , minHeight: 100 }} >
            <HeaderMain/>
          </Header>
          <Content style={{ margin: '22px 16px' }}>
          </Content>
          <Footer style={{ textAlign: 'center' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    );
  }
}