import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';

class UpdateCategory extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired
  };

  validator=(rule,value,callback)=>{
    if(!value){
      callback('请输入品类名称')
    } else{
      callback()
    }
  };

  render() {
    const { getFieldDecorator } =this.props.form;

    return <Form>
      <Form.Item>
        {
          getFieldDecorator(
            "categoryName",{
              rules:[{
                validator:this.validator
              }],
              //后面走的是更新，所以不起作用了//外面用reset来回复默认值！！！
              initialValue:this.props.categoryName
            }
          )(
            <Input />
          )
        }
      </Form.Item>
    </Form>;
  }
}

export default Form.create()(UpdateCategory);