import React, { Component } from 'react';
import { Card, Icon, Input, Button, Select, Table } from 'antd';
import MyButton from '../../../cpmponents/my-button';
import { reqProductList, reqSearchProductList } from '../../../api';

import './index.less'

const { Option } = Select;


export default class Index extends Component {

  state={
    products:[],
    total:0,
    isloading:true,
    searchType:"productName",
    searchContent:"",
    pageNum:1,
    pageSize:3,
    isSearch:false
  };

  componentDidMount() {
    this.getProduct(1,3);

  }

  getProduct= async (pageNum,pageSize)=>{
    this.setState({
      isloading:true
    });
    const { searchType, searchContent } = this.state;
    let promise = null;
    if(searchContent){
      promise = reqSearchProductList({searchType, searchContent, pageNum, pageSize});
    }else {
      promise = reqProductList(pageNum,pageSize);
    }
    const result = await promise;
    if(result){
      this.setState({
        products:result.data.list,
        total:result.data.total,
        isloading:false,
        pageNum,
        pageSize
      })
    }
  };

  updateProduct=(product)=>{
    return ()=>{
      this.props.history.push('/product/saveupdate',product);
    }
  };

  goSaveUpdate=()=>{
    this.props.history.push('/product/saveupdate');
  };
  
  handleChange(stateName){
    return (e)=>{
      e = e.target? e.target.value : e; 
      this.setState({
        [stateName]:e
      })
    }
  }

  search = async ()=>{
    const { pageNum ,pageSize } = this.state;
    this.getProduct( pageNum, pageSize )
  };
  
  render() {
    const { products, total, isloading } = this.state;

    const columns=[
      {
        title:"商品名称",
        dataIndex:"name",
        key:"name"
      },
      {
        title:"商品描述",
        dataIndex:"desc",
        key:"desc"
      },
      {
        title:"价格",
        dataIndex:"price",
        key:"price"
      },
      {
        title:"状态",
        className:"product-status",
        dataIndex:"status",
        render:data=>{
          return  data === 1 ?<div><Button type="primary">上架</Button>&nbsp;&nbsp;&nbsp;已下架</div>:
           <div><Button type="primary">下架</Button>&nbsp;&nbsp;&nbsp;在售</div>
        }
      },
      {
        title:"操作",
        className:"product-status",
        render: product=>{
          return <div><MyButton>详情</MyButton><MyButton onClick={this.updateProduct(product)}>修改</MyButton></div>
        }
      }
    ];

    return <Card
      title={<div>
        <Select defaultValue={"productName"} onChange={this.handleChange('searchType')}>
        <Option key={0} value={"productName"}>根据商品名称</Option>
        <Option key={1} value={"productDesc"}>根据商品描述</Option>
      </Select>
      <Input placeholder="关键字" className="search-input" onChange={this.handleChange('searchContent')}/>
        <Button type="primary" onClick={this.search}>搜索</Button>
      </div>}

      extra={<Button type="primary" onClick={this.goSaveUpdate}><Icon type="plus"/>添加产品</Button>}
    >
    <Table
    dataSource={products}
    columns={columns}
    bordered
    loading={isloading}
    rowKey="_id"
    pagination={{
      showQuickJumper:true,
      showSizeChanger:true,
      defaultPageSize:3,
      pageSizeOptions:["3","6","9"],
      onChange:this.getProduct,
      onShowSizeChange:this.getProduct,
      total
    }}
    >
    </Table>
    </Card>;
  }
}