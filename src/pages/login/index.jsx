import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import logo from '../../assets/images/logo.png';
import './index.less';
import { reqLogin } from '../../api'

const Item = Form.Item;

function Login (props) {

  const validator=(rule,value,callback)=>{
    const name = rule.fullField === 'username'?'用户名':'密码';
    if(!value){
      callback(`${name}不能为空！`)
    }else if (value.length < 4){
      callback(`${name}长度不能小于4`)
    } else if (value.length > 10){
      callback(`${name}长度不能大于10`)
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)){
      callback(`${name}只能包含数字字母下划线`)
    } else {
      callback();
    }
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    props.form.validateFields(async (errors,values)=>{
      if(!errors){
        const { username, password } = values;
        const result= await reqLogin(username,password);
        if(result){
          props.history.replace('/')
        }else {
          props.form.resetFields(['password']);
        }
      }else {
        console.log(errors)
      }
    })
  };

  const { getFieldDecorator } = props.form;



    return <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo"/>
        <h1>React项目: 后台管理系统</h1>
      </header>
      <section className="login-form">
        <h2>用户登录</h2>
        <Form onSubmit={handleSubmit}>
          <Item>
            {
              getFieldDecorator('username',{
                rules:[/*{required:true,message:'用户名不能为空！'},
                  {min:4,message:'用户名最小为4'},
                  {max:10,message:'用户名最大为10'},
                  {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名只能包含数字字母下划线'}*/
                {validator:validator}
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
                rules:[{validator:validator}]
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
export default Form.create()(Login);