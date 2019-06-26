import React, { Component } from 'react';
import { Card, Icon, Form, Input, Cascader, InputNumber, Button } from 'antd';
import { reqCategory } from '../../../api';
import ReactTextEditor from './rich-text-editor';

import './index.less';

const { Item } = Form;

export default class SaveUpdate extends Component {
  state={
    productList:[],
  };

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    const result = await reqCategory(targetOption.value);
    if(result){
      targetOption.loading = false;
      targetOption.children=result.data.map((item)=>{
        return {
          label:item.name,
          value:item._id
        }
      });
      this.setState({
        productList: [...this.state.productList],
      });
    }
  };

  saveUpdate=(e)=>{
    e.preventDefault();
  };
  
  async componentDidMount() {
    const result = await reqCategory("0");
    if(result){
      this.setState({
        productList:result.data.map((item)=>{
          return {
            value:item._id,
            label:item.name,
            isLeaf: false
          }
        })
      })
    }
  }

  render() {
    const { productList } = this.state;
    const formItemLayout={
      labelCol:{
        sm:{span:2}
      },
      wrapperCol:{
        sm:{span:9}
      }
    };

    return <Card
    title={<div className="title-icon">
      <Icon type="arrow-left"/>
      <span>添加商品</span>
 </div>}>
      <Form {...formItemLayout} onSubmit={this.saveUpdate}>
        <Item label="商品名称">
          <Input placeholder="请输入商品名称"/>
        </Item>
        <Item label="商品描述">
          <Input placeholder="请输入商品描述"/>
        </Item>
        <Item label="选择分类" wrapperCol={{span:5}} >
          <Cascader options={productList} loadData={this.loadData} placeholder="请选择分类"/>
        </Item>
        <Item label="商品价格">
          <InputNumber
            defaultValue={1000}
            formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Item>
        <Item label="商品详情">
          <ReactTextEditor/>
        </Item>
        <Button type="primary" htmlType="submit" className="submit">提交 </Button>
      </Form>
    </Card>;
  }
}