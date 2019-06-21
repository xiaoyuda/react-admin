import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import logo from './logo.png';
import './index.less';

const Item = Form.Item;

class Login extends Component {

  validator=(rule,value,callback)=>{
    const name = rule.fullField === 'username'?'用户名':'密码';
    if(!value){
      callback('用户名不能为空')
    }
  };

  render() {
    const { getFieldDecorator } =this.props.form;

    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login-form">
        <h2>用户登录</h2>
        <Form>
          <Item>
            {
              getFieldDecorator('username',{
                rules:[/*{required:true,message:'用户名不能为空！'},
                  {min:4,message:'用户名最小为4'},
                  {max:10,message:'用户名最大为10'},
                  {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名只能包含数字字母下划线'}*/
                {validator:this.validator}
              ]
              })(
                <Input className="login-input"
                       prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.8)' }} />}
                       placeholder="用户名"
                />
              )
            }
          </Item>
          <Item>
            {
              getFieldDecorator('password',{
                rules:[{validator: this.validator}]
              })(
                <Input className="login-input"
                       type="password"
                       prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.8)' }} />}
                       placeholder="密码"
                />
              )
            }
          </Item>
          <Item>
            <Button className="login-input" type="primary" htmlType="submit">登录</Button>
          </Item>
        </Form>
      </section>
    </div>;
  }
}
export default Form.create()(Login);