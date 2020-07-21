import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Qs from 'qs';
import { RViewer } from './RViewer';
import { RSelectTool } from './RSelectTool';
import { RInfoTool } from './RInfoTool';


import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
    let tmp = [];
    try{
      tmp = JSON.parse(Cookies.get('viewerPath'));
    }catch(e){
      console.log(e);
    }
    this.state = {
      viewerPath: tmp,
      pathTree: {},
      index: 0,
      selectToolIndex: 1,
      uploadFilePath: "",
    };
    this.loadPdf = this.loadPdf.bind(this);
    this.loadPathTree = this.loadPathTree.bind(this);
    this.deletePdf = this.deletePdf.bind(this);
    this.deletePdfAll = this.deletePdfAll.bind(this);
    this.changeIndex = this.changeIndex.bind(this);
    this.changeSelectToolIndex = this.changeSelectToolIndex.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.handleChangeUploadFile = this.handleChangeUploadFile.bind(this);
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
      alert("token失效，重新登录");
      return;
    }
    axios({
      method: 'post',
      url: 'http://127.0.0.1:8080/uploadPdf',
      data: formData,
      headers: {
          'token': token,
          // 'Content-Type': 'multipart/form-data',
      },
    })
    .then(function (response) {
        if (response.data.status==='true'){
          // _this.setState({pathTree: response.data.data});
          alert(response.data);
        }
        else{
            alert('上传文件失败');
        } 
    })
    .catch(function (error) {
        console.log(error);
    });
  }
  uploadFile(path){
    this.setState({uploadFilePath: path});
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
        url: 'http://127.0.0.1:8080/tokenToPath',
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
        else{
          alert("获取pathtree失败");
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
          pathTree={this.state.pathTree} selectToolIndex={this.state.selectToolIndex} uploadFile={this.uploadFile}/>
        </div>
        <div id="Main2Grid">
          <RViewer viewerPath={this.state.viewerPath} index={this.state.index} 
          changeIndex={this.changeIndex} deletePdf={this.deletePdf}/>
        </div>
        <input type="file" id="UploadFileInput" onChange={this.handleChangeUploadFile}/>
      </div>
    );
  }
}

export default App;
