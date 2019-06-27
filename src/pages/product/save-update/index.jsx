import React, { Component } from 'react';
import { Card, Icon, Form, Input, Cascader, InputNumber, Button, message } from 'antd';
import { reqCategory, reqAddProduct } from '../../../api';
import RichTextEditor from "./rich-text-editor";
import { convertToRaw } from 'draft-js';

import './index.less';
import draftToHtml from "draftjs-to-html";

const { Item } = Form;


class SaveUpdate extends Component {
  state={
    productList:[],
  };

  richTextRef = React.createRef();
  
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
    this.props.form.validateFields(async (errors,values)=>{
      if(!errors){
        //先把antd能获取的拿到手
        const  { name, price, desc, categoriesId } = values;
        let pCategoryId ="0";
        let categoryId = "";

        if(categoriesId.length === 1){
          categoryId = categoriesId[0]
        }else {
          pCategoryId = categoriesId[0];
          categoryId = categoriesId[1];
        }

        //想办法拿富文本的值
        const detail = draftToHtml(convertToRaw(this.richTextRef.current.state.editorState.getCurrentContent()));

        //拿完可以发请求了
        const result = await reqAddProduct({name, price, categoryId, pCategoryId, detail, desc})
        if (result){
          message.success("添加商品成功~")
        }
      }
    })
  };

  goBack=()=>{
    this.props.history.goBack();
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
    const { getFieldDecorator } = this.props.form;
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
      <Icon type="arrow-left" onClick={this.goBack}/>
      <span>添加商品</span>
 </div>}>
      <Form {...formItemLayout} onSubmit={this.saveUpdate}>
        <Item label="商品名称">
          {
            getFieldDecorator(
              'name',
              {
                rules:[{
                  required:true,message:"商品名称不能为空！"
                }]
              }
            )(
              <Input placeholder="请输入商品名称"/>
            )
          }
        </Item>
        <Item label="商品描述">
          {
            getFieldDecorator(
              'desc',
              {
                rules:[{
                  required:true,message:"商品描述不能为空！"
                }]
              }
            )(
              <Input placeholder="请输入商品描述"/>
            )
          }
        </Item>
        <Item label="选择分类" wrapperCol={{span:5}} >
          {
            getFieldDecorator(
              'categoriesId',{
                rules:[{
                  required:true,message:"分类不能为空！"
                }]
              }
            )(
              <Cascader options={productList} loadData={this.loadData} placeholder="请选择分类"/>
            )
          }
        </Item>
        <Item label="商品价格">
          {
            getFieldDecorator(
              'price',{
                rules:[{
                  required:true,message:"请输入价格"
                }]
              }
            )(
              <InputNumber
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            )
          }
        </Item>
        <Item label="商品详情">
          <RichTextEditor ref={this.richTextRef}/>
        </Item>
        <Button type="primary" htmlType="submit" className="submit">提交 </Button>
      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate);