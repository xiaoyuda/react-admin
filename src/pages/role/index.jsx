import React, {Component} from 'react';
import {Card, Button, Table, Radio, Modal, message} from 'antd';
import { reqRoleList, reqAddRole, reqUpdateRole } from '../../api'
import dayjs from 'dayjs';
import  { getItem } from '../../utils/storage-tool'

import AddRoleForm from './add-role-form';
import UpdateRoleForm from './update-role-form';

const RadioGroup = Radio.Group;

export default class Role extends Component {
  state = {
    //有了value要去哪里找名字呢？
    value: '',  //单选的默认值，也就是选中的某个角色的id值
    roles: [], //权限数组
    isShowAddRoleModal: false, //是否展示创建角色的标识
    isShowUpdateRoleModal: false, //是否展示设置角色的标识
    isDisabled: true,
  };
  
  componentWillMount () {
    this.columns = [{
      dataIndex: '_id',
      render: id => <Radio value={id} />
    }, {
      title: '角色名称',
      dataIndex: 'name',
    }, {
      title: '创建时间',
      dataIndex: 'create_time',
      render: time => dayjs(time).format("YYYY-MM-DD HH-mm-ss")
    }, {
      title: '授权时间',
      dataIndex: 'auth_time',
      render: auth_time =>auth_time?dayjs(auth_time).format("YYYY-MM-DD HH-mm-ss"):""
    }, {
      title: '授权人',
      dataIndex: 'auth_name',
    }];
  }

  async componentDidMount () {
    const result = await reqRoleList();
    if(result){
      this.setState({
        roles:result.data
      })
    }
  }

  onRadioChange = (e) => {
    // console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
      isDisabled: false
    });
  }
  
  isShowModal = (name, flag) => {
    this.setState({[name]: flag})
  };
  
  //创建角色的回调函数
  handleAddRole = () => {
    this.addRoleForm.props.form.validateFields( async (err,values)=>{
      if(!err){
        const result = await reqAddRole(values.name);
        if(result){
          message.success('添加角色成功~');
          this.setState({
            isShowAddRoleModal: false,
            roles:[...this.state.roles,result.data]
          })
        }
      }
    })
  };
  //设置角色权限的回调函数
  handleUpdateRole = async () => {
    //点击ok的时候要拿到menu
   const menus = this.updateRoleForm.state.checkedKeys;
   const auth_name = getItem().username;
   const _id = this.state.value;
   const result = await reqUpdateRole(_id, auth_name, menus);
   if(result){
     message.success("更新角色成功~");
     this.setState({
       roles:this.state.roles.map((role)=>{
         if(role._id === _id){
            return result.data
         }else {
            return role;
         }
       }),
       isShowUpdateRoleModal:false
     })
   }
  };
  
  render () {
    const {roles, value, isDisabled, isShowAddRoleModal, isShowUpdateRoleModal} = this.state;
    const role = roles.find((role)=>role._id === value);
    return (
      <Card
        title={
          <div>
            <Button type='primary' onClick={() => this.isShowModal('isShowAddRoleModal', true)}>创建角色</Button> &nbsp;&nbsp;
            <Button type='primary' disabled={isDisabled} onClick={() => this.isShowModal('isShowUpdateRoleModal', true)}>设置角色权限</Button>
          </div>
        }
      >
        <RadioGroup onChange={this.onRadioChange} value={value} style={{width: '100%'}}>
          <Table
            columns={this.columns}
            dataSource={roles}
            bordered
            rowKey='_id'
            pagination={{
              defaultPageSize: 5,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              showQuickJumper: true,
            }}
          />
        </RadioGroup>
  
        <Modal
          title="创建角色"
          visible={isShowAddRoleModal}
          onOk={this.handleAddRole}
          onCancel={() => this.isShowModal('isShowAddRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <AddRoleForm wrappedComponentRef={(form) => this.addRoleForm = form}/>
        </Modal>
  
        <Modal
          title="设置角色权限"
          visible={isShowUpdateRoleModal}
          onOk={this.handleUpdateRole}
          onCancel={() => this.isShowModal('isShowUpdateRoleModal', false)}
          okText='确认'
          cancelText='取消'
        >
          <UpdateRoleForm wrappedComponentRef={(form) => this.updateRoleForm = form} name={role?role.name:""} menus={role?role.menus:[]}/>
        </Modal>
        
      </Card>
    )
  }
}
