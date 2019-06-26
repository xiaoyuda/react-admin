import React, { Component } from 'react';
import { Card, Form, Icon, Input, Button, Select, Table } from 'antd';
import MyButton from '../../../cpmponents/my-button';
import { reqProductList } from '../../../api';

import './index.less'

const { Item } = Form;
const { Option } = Select;


export default class Index extends Component {

  state={
    products:[],
  };

  async componentDidMount() {
    const result = await reqProductList(1,3);
    if(result){
      this.setState({
        products:result.data.list
      })
    }
  }

  goSaveUpdate=()=>{
    this.props.history.push('/product/saveupdate');
  };

  render() {
    const { products } = this.state;

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
        render: data=>{
          return <div><MyButton>详情</MyButton><MyButton>修改</MyButton></div>
        }
      }
    ];

    return <Card
      title={<div>
        <Select defaultValue={0}>
        <Option key={0} value={0}>根据商品名称</Option>
        <Option key={1} value={1}>根据商品描述</Option>
      </Select>
      <Input placeholder="关键字" className="search-input"/>
        <Button type="primary">搜索</Button>
      </div>}

      extra={<Button type="primary" onClick={this.goSaveUpdate}><Icon type="plus"/>添加产品</Button>}
    >
    <Table
    dataSource={products}
    columns={columns}
    bordered
    pagination={{
      showQuickJumper:true,
      showSizeChanger:true,
      defaultPageSize:3,
      pageSizeOptions:["3","6","9"]
    }}
    >

    </Table>
    </Card>;
  }
}