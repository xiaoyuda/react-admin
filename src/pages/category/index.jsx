import React, { Component } from 'react';
import { Card, Button, Icon, Table } from "antd";
import MyButton from '../../cpmponents/my-button';
import './index.less';

import { reqCategory } from '../../api';

export default class Category extends Component {

  state={
    data:[]
  };

  async componentDidMount() {
    const result = await reqCategory('0');
    const data = result.data.map((item,index)=>{
      return { key: `${index+1}` ,name:item.name }
    });
    this.setState({
      data
    })

  }

  render() {
    const columns = [
      {
        title: '品类名称',
        dataIndex: 'name',

      },
      {
        title: '操作',
        className: 'operation',
        dataIndex: 'operation',
        render: text => <div>
          <MyButton >修改内容</MyButton>
          <MyButton >查看其子品类</MyButton>
        </div>,
      },
    ];


    return (<div>
      <Card title="一级分类列表" extra={<Button type="primary"><Icon type="plus" />添加分类</Button>} style={{ width: "100% "}}>
        <Table
          columns={columns}
          dataSource={this.state.data}
          bordered
          pagination={{
            pageSize:3,
            showQuickJumper:true,
            pageSizeOptions:["3","6","9"]
          }}
        />
      </Card>
    </div>);
  }
}