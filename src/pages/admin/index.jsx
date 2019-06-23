import React, { Component } from 'react';
import LeftMenu from '../../cpmponents/left-menu'
import { Layout, Breadcrumb } from 'antd';
import HeaderMain from '../../cpmponents/header-main';
import ContentMain from '../../cpmponents/content-main';

const { Header, Content, Footer, Sider } = Layout;

export default class Admin extends Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

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
            <ContentMain/>
          </Content>
          <Footer style={{ textAlign: 'center' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    );
  }
}