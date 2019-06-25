import React, { Component } from 'react';
// import {getItem} from "../../utils/storage-tool";
import {reqValidatorUser} from "../../api";

export default class Home extends Component {
  render() {
    return <div style={{textAlign:'center', height:360, lineHeight:'360px', fontSize:25, fontWeight:'bolder'}}>
      欢迎来到硅谷后台管理系统
    </div>;
  }
}