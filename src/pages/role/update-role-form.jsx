import React, {Component} from 'react';
import {Form, Input, Tree} from 'antd';
import menuList from '../../config/menu-config';
import PropTypes from 'prop-types';

const Item = Form.Item;
const { TreeNode } = Tree;

class UpdateRoleForm extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    menus: PropTypes.array.isRequired,

  };

  state = {
    selectedKeys: [],
    checkedKeys:this.props.menus
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      checkedKeys:nextProps.menus
    })
  }

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {
            this.renderTreeNodes(item.children)
          }
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })
  
  onCheck=(checkedKeys)=>{
    this.setState({
      checkedKeys
    })
  }
  
  render () {
    const {getFieldDecorator} = this.props.form;
    console.log(this.props.menus)
    return (
      <Form>
        <Item label='角色名称'>
          {
            getFieldDecorator(
              'name',
              {
                initialValue: this.props.name
              }
            )(
              <Input placeholder='请输入角色名称' disabled/>
            )
          }
        </Item>
        <Item>
          <Tree
            checkable
            defaultExpandAll={true}
            //因为初次渲染默认值只会存在一次，之后每次都是上一次的值，所以既要有值，又必须能改？
            checkedKeys={this.state.checkedKeys}
            onCheck={this.onCheck}
          >
            {this.renderTreeNodes(menuList)}
          </Tree>
        </Item>
      </Form>
    )
  }
}

export default Form.create()(UpdateRoleForm)