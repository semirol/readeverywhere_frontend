import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Qs from 'qs';
import { RViewer } from './RViewer';
import { RSelectTool } from './RSelectTool';
import { RInfoTool } from './RInfoTool';
import { RAlertBlock } from './RAlertBlock';
import { RConfig } from './RConfig';


import './App.css';
import { myAlert } from './RScripts';

class App extends React.Component{
  constructor(props){
    super(props);
    let tmp = [];
    try{
      tmp = JSON.parse(Cookies.get('viewerPath'));
    }catch(e){
      console.log(e);
    }
    const userEmail = Cookies.get("userEmail");
    this.state = {
      viewerPath: tmp,
      pathTree: {},
      index: 0,
      selectToolIndex: (userEmail===''||!userEmail)? 0:1,
      uploadFilePath: "",
      rAlertBlockDisplay: 0,
      newDirPath: "",
    };
    this.loadPdf = this.loadPdf.bind(this);
    this.loadPathTree = this.loadPathTree.bind(this);
    this.deletePdf = this.deletePdf.bind(this);
    this.deletePdfAll = this.deletePdfAll.bind(this);
    this.changeIndex = this.changeIndex.bind(this);
    this.changeSelectToolIndex = this.changeSelectToolIndex.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.deleteFile = this.deleteFile.bind(this);
    this.newDir = this.newDir.bind(this);
    this.handleChangeUploadFile = this.handleChangeUploadFile.bind(this);
    this.changeRAlertBlockDisplay = this.changeRAlertBlockDisplay.bind(this);
  }
  componentDidMount(){
    this.loadPathTree();
  }
  changeIndex(index){
    this.setState({index});
  }
  changeSelectToolIndex(selectToolIndex){
    this.setState({selectToolIndex});
  }
  handleChangeUploadFile(event){
    let _this = this;
    let formData = new FormData();
    formData.append("file",event.target.files[0]);
    formData.append("path",_this.state.uploadFilePath);
    let token = Cookies.get("token");
    if (!token||token===""){
      myAlert("token失效，重新登录");
      return;
    }
    axios({
      method: 'post',
      url: 'http://'+RConfig.serverIp+':'+RConfig.serverPort+'/uploadPdf',
      data: formData,
      headers: {
          'token': token,
          // 'Content-Type': 'multipart/form-data',
      },
    })
    .then(function (response) {
        if (response.data.status==='true'){
          _this.loadPathTree();
        }
        else if (response.data.status==='noEnoughSpace'){
          myAlert('可用空间不足');
        }
        else{
            myAlert('上传文件失败');
        } 
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  uploadFile(path){
    this.setState({uploadFilePath: path});
  }
  deleteFile(path){
    let token = Cookies.get("token");
    if (!token||token===""){
      myAlert("token失效，重新登录");
      return;
    }
    let _this = this;
    axios({
      method: 'post',
      url: 'http://'+RConfig.serverIp+':'+RConfig.serverPort+'/deletePdfOrDir',
      data: Qs.stringify({
        path,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'token': token,
      },
    })
    .then(function (response) {
        if (response.data.status=='true'){
          _this.loadPathTree();
        }
        else{
            myAlert('删除文件失败');
        } 
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  newDir(path){
    this.setState({
      rAlertBlockDisplay: 1,
      newDirPath: path,
    });
  }
  loadPdf(path){
    this.state.viewerPath.push([path,new Date().getTime()]);
    console.log(this.state.viewerPath);
    Cookies.set('viewerPath',JSON.stringify(this.state.viewerPath));
    this.setState({
      viewerPath:this.state.viewerPath,
      index:this.state.viewerPath.length-1,
    });
  }
  getPathIndex(path,date){
      for (var i = 0; i < this.state.viewerPath.length; i++) { 
        if (this.state.viewerPath[i][0] == path && this.state.viewerPath[i][1] == date) return i; 
      } 
      return -1; 
  }
  deletePdf(path,date){
    let index = this.getPathIndex(path,date);
    if (index!=-1){
      this.state.viewerPath.splice(index,1);
      if (this.state.index==0){
      
      }
      else if (index<=this.state.index){
        this.state.index -= 1;
      }
      this.setState({
        viewerPath:this.state.viewerPath,
        index:this.state.index,
      });
      Cookies.set('viewerPath',JSON.stringify(this.state.viewerPath));
    }
  }
  deletePdfAll(){
    this.setState({viewerPath:[]});
    Cookies.set('viewerPath',JSON.stringify(this.state.viewerPath));
  }
  loadPathTree(){
    let _this = this;
    let token = Cookies.get("token");
    if (token!=''&&token){
      axios({
        method: 'post',
        url: 'http://'+RConfig.serverIp+':'+RConfig.serverPort+'/tokenToPath',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token':token,
        },
      })
      .then(function (response) {
        if (response.data.status==="true"){
          console.log(response.data.data);
          _this.setState({pathTree: JSON.parse(response.data.data)});
        }
        else if (response.data.status==="expired"){
          myAlert("登录状态过期,请重新登录");
        }
        else {
          myAlert("账号不存在");
        }
      })
      .catch(function (error) {
          console.log(error);
      });
    }
    else{
      _this.setState({
        pathTree:{}});
    }
  }
  changeRAlertBlockDisplay(int01){
    this.setState({rAlertBlockDisplay:int01});
  }
  render(){
    return (
      <div className="App">
        <div id="Main0Grid">
          <RSelectTool selectToolIndex={this.state.selectToolIndex}
          changeSelectToolIndex={this.changeSelectToolIndex}/>
        </div>
        <div id="Main1Grid">
          <RInfoTool loadPathTree={this.loadPathTree} deletePdfAll={this.deletePdfAll}
          loadPdf={this.loadPdf} changeIndex={this.changeIndex} index={this.state.index}
          deletePdf={this.deletePdf} viewerPath={this.state.viewerPath}
          pathTree={this.state.pathTree} selectToolIndex={this.state.selectToolIndex} 
          uploadFile={this.uploadFile} deleteFile={this.deleteFile}
          newDir={this.newDir}/>
        </div>
        <div id="Main2Grid">
          <RViewer viewerPath={this.state.viewerPath} index={this.state.index} 
          changeIndex={this.changeIndex} deletePdf={this.deletePdf}/>
        </div>
        <input type="file" id="UploadFileInput" onChange={this.handleChangeUploadFile}/>
        <RAlertBlock changeRAlertBlockDisplay={this.changeRAlertBlockDisplay}
        newDirPath={this.state.newDirPath} loadPathTree={this.loadPathTree} 
        isDisplay={this.state.rAlertBlockDisplay}/>
        <div id="RAlertInfo" isdisplay="false"></div>
      </div>
    );
  }
}

export default App;
