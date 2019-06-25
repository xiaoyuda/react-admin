import React, { Component } from 'react';
import { Card, Button, Icon, Table, Modal, message } from "antd";
import  AddCategory  from '../../cpmponents/add-category';
import MyButton from '../../cpmponents/my-button';
import { addCategory, reqUpdateCategoryName } from '../../api';
import UpdateCategory from '../../cpmponents/update-category';
import './index.less';

import { reqCategory } from '../../api';



export default class Category extends Component {

  state={
    category:[],
    isShowAddCategory:false,
    isShowUpdateCategory:false,
    categoryName:''
  };

  async componentDidMount() {
    const result = await reqCategory('0');
   if(result){
     this.setState({
       category:result.data,
     })
   }
  }

  showAddCategory=()=>{
    this.setState({
      isShowAddCategory:true,
    })
  };

  hideAddCategory=()=>{
    this.setState({
      isShowAddCategory:false,
    })
  };

  AddCategory=()=>{
    //验证通过添加分类
    const { form } = this.addCategoryForm.props;
    form.validateFields(async (errors,values)=>{
      if(!errors){
        const { parentId, categoryName } = values;
        const result = await addCategory(parentId,categoryName);
        if(result){
          message.success("添加分类成功~~");
          //如果是一级分类还要立马显示
          if(parentId === "0"){
            this.setState({
              category:[...this.state.category,result.data]
            })
          }
          this.setState({
            isShowAddCategory:false
          });
          //还要清空输入框
          form.resetFields(["parentId","categoryName"])
        }
      }
    })
  };

  showUpdateCategory=(categoryName,categoryId)=>{
    return ()=>{
      this.setState({
        isShowUpdateCategory:true,
        categoryName,
        categoryId
      })
    }

  };

  updateCategory =async ()=>{
    const { form } = this.updateCategoryForm.props;
    const { categoryName, categoryId } =this.state;

    //先校验名字是不是和之前一样
    const newCategoryName = form.getFieldValue("categoryName");
    if( newCategoryName === categoryName){
      return message.error("名字未更改，请检查后重试~")
    }

    //发送请求
    const result = await reqUpdateCategoryName(categoryId,newCategoryName);
    if(result.status === 0){
      message.success('修改成功~~');
      //要把内容改成修改后的内容
      //老师不希望修改原来的category，所以要造一个一模一样的，但是改变修改的内容
      const newCategory=this.state.category.map((item)=>{
        if(item._id === categoryId){
          const { _id, parentId  } = item;
          return {
            _id,
            name:newCategoryName,
            parentId
          }
        }
        return item;
      });
      this.setState({
        category:newCategory
      })
    }
    form.resetFields();
    this.setState({
      isShowUpdateCategory:false,
    })
  };

  hideUpdateCategory=()=>{
    this.updateCategoryForm.props.form.resetFields();
    this.setState({
      isShowUpdateCategory:false,
    })
  };

  render() {
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        className: 'operation',
        // dataIndex: 'operation',
        render: text => <div>
          <MyButton onClick={this.showUpdateCategory(text.name,text._id)}>修改内容</MyButton>
          <MyButton >查看其子品类</MyButton>
        </div>,
      },
    ];

    const { category, isShowAddCategory, isShowUpdateCategory, categoryName } = this.state;


    return (
      <Card title="一级分类列表" extra={<Button type="primary" onClick={this.showAddCategory}><Icon type="plus" />添加分类</Button>} style={{ width: "100% "}}>
        <Table
          columns={columns}
          dataSource={category}
          bordered
          pagination={{
            pageSize:3,
            showQuickJumper:true,
            pageSizeOptions:["3","6","9"]
          }}
          rowKey="_id"
        />
        <Modal
          title="添加分类"
          visible={isShowAddCategory}
          onOk={this.AddCategory}
          onCancel={this.hideAddCategory}
          okText="确认"
          cancelText="取消"
        >
          <AddCategory category={category}  wrappedComponentRef={(form) => this.addCategoryForm = form}/>
        </Modal>
        <Modal
          title="更新分类"
          visible={isShowUpdateCategory}
          onOk={this.updateCategory}
          onCancel={this.hideUpdateCategory}
          okText="确认"
          cancelText="取消"
        >
          <UpdateCategory categoryName={categoryName}  wrappedComponentRef={(form) => this.updateCategoryForm = form}/>
        </Modal>
      </Card>
    );
  }
}