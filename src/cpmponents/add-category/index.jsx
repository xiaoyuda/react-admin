import React, { Component } from 'react';
import {Form, Input, Select} from "antd";
import PropTypes from 'prop-types';

const { Item } = Form;
const { Option } = Select;

class AddCategory extends Component {
  static propTypes = {
    category: PropTypes.array.isRequired
  };

  validator=(rule, value, callback)=> {
    if (!value) {
      callback("请输入品类名称~");
      return
    }
    const result = this.props.category.find((item) => item.name === value);
    if (result) {
      callback("名字已存在！")
    }else {
      callback();
    }
  };
  
  render() {
    const { getFieldDecorator } = this.props.form;

    return <Form>
      <Item label="所属分类">
      {getFieldDecorator(
          "parentId",{
            initialValue:"0"
        }
        )(
            <Select  style={{width: "100%"}}>
              <Option value="0"> 一级分类 </Option>
              {
                this.props.category.map((item) => {
                  return <Option key={item._id}>{item.name}</Option>
                })
              }
            </Select>
        )}
      </Item>
      <Item label="分类名称">
      {
        getFieldDecorator(
          "categoryName",
          {rules:[
            {validator:this.validator}
            ]}
        )(

            <Input/>

        )
      }
      </Item>
    </Form>;
  }
}

export default Form.create()(AddCategory);