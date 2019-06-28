import { Upload, Icon, Modal } from 'antd';
import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { reqDeleImg } from '../../../../api'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {

  static propTypes={
    imgs: PropTypes.array.isRequired,
    id: PropTypes.string.isRequired
  };

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: this.props.imgs.map((img,index)=>{
      return{
        uid:-index,
        name:img,
        status:'done',
        url:`/upload/${img}`
      }
    })
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = async ({ file,fileList }) =>{
    if(file.status === "done"){
      message.success("图片上传成功")
    }else if(file.status ==="error"){
      message.error("操作失败，请重试")
    }else if(file.status ==="uploading"){
      //
    }else{
      //发送删除图片的请求
      const id =this.props.id;
      const name = file.name;
      const result = await reqDeleImg(id,name);
      if(result){
        message.success("删除文件成功~")
      }
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          data={{id:this.props.id}}
          name="image"
        >
          {fileList.length >= 5 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}