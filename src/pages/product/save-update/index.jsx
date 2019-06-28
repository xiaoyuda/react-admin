import React, { Component } from 'react';
import { Card, Icon, Form, Input, Cascader, InputNumber, Button, message } from 'antd';
import { reqCategory, reqAddProduct, reqUpdateProduct } from '../../../api';
import RichTextEditor from "./rich-text-editor";
import { convertToRaw } from 'draft-js';
import PictureWall from './picture-wall';

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
        const product = this.props.location.state;
        const reqProduct ={name, price, categoryId, pCategoryId, detail, desc};
        let promise = null;
        if(product){
          reqProduct._id=product._id;
          promise = reqUpdateProduct(reqProduct);
        }else {
          promise = reqAddProduct(reqProduct);
        }
        const result = await promise;
        if (result){
          if(product){
            message.success("更新商品成功~")
          }else {
            message.success("添加商品成功~")
          }
        }
      }
    })
  };

  goBack=()=>{
    this.props.history.goBack();
  };

  async componentDidMount() {
    //不管是添加还是更新都要请求一级数据
    const product = this.props.location.state;
    const result = await reqCategory("0");
    if(result){
      //先判断是添加还是更新
      if(product){
        //这是更新
        this.categories=[];
        if(product.pCategoryId !== "0"){
          this.categories.push(product.pCategoryId)
        }
        this.categories.push(product.categoryId);
        if(product.pCategoryId === "0"){
          this.setState({
            productList:result.data.map((item)=>{
              return {
                value:item._id,
                label:item.name,
                isLeaf: false
              }
            })
          })
        }else{//注重！！！！二级分类的请求
          const secResult = await reqCategory(product.pCategoryId);
          if(secResult){
            const children = secResult.data.map((sec)=>{
              return{
                value:sec._id,
                label:sec.name,
              }
            });
            this.setState({
              productList:result.data.map((item)=>{
                //判断条件写错了
                if( item._id === product.pCategoryId){
                  return {
                    value:item._id,
                    label:item.name,
                    isLeaf: false,
                    children
                  }
                }else {
                  return{
                    value:item._id,
                    label:item.name,
                    isLeaf: false,
                  }
                }
              })
            })
          }
        }
      }else {
        //这是添加
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

    const product = this.props.location.state;

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
                  required:true,
                  message:"商品名称不能为空！",
                }],
                initialValue: product?product.name:"",
              }
            )(
              <Input placeholder="请输入商品名称"
                     />
            )
          }
        </Item>
        <Item label="商品描述">
          {
            getFieldDecorator(
              'desc',
              {
                rules:[{
                  required:true,message:"商品描述不能为空！",
                }],
                initialValue: product? product.desc: ""
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
                  required:true,message:"分类不能为空！",
                }],
                initialValue:product?this.categories:[]
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
                  required:true,message:"请输入价格",
                }],
                initialValue:product?product.price:""
              }
            )(
              <InputNumber
                formatter={value => `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                // parser={value => value.replace(/\$\s?|(,*)/g, '')}
              />
            )
          }
        </Item>
        <Item label="商品图片">
          <PictureWall imgs={product?product.imgs:[]} id={product?product._id:""}/>
        </Item>
        <Item label="商品详情">
          <RichTextEditor ref={this.richTextRef} detail={product?product.detail:""}/>
        </Item>
        <Button type="primary" htmlType="submit" className="submit">提交 </Button>
      </Form>
    </Card>;
  }
}

export default Form.create()(SaveUpdate);