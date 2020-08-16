import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Qs from 'qs';

import { myAlert } from './RScripts';
import { RConfig } from './RConfig';


import './RAlertBlock.css';

class RAlertBlock extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            inputValue: "",
        }
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleClickButton = this.handleClickButton.bind(this);
    }
    handleChangeInput(event){
        this.setState({inputValue: event.target.value});
    }
    handleClickButton(){
        let _this = this;
        let token = Cookies.get("token");
        if (token!==''&&token&&this.state.inputValue!==""){
            axios({
              method: 'post',
              url: 'http://'+RConfig.serverIp+':'+RConfig.serverPort+'/newDir',
              data: Qs.stringify({
                path: this.props.newDirPath,
                dirName: this.state.inputValue,
              }),
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'token':token,
              },
            })
            .then(function (response) {
              if (response.data.status==="true"){
                _this.props.loadPathTree();
              }
              else if(response.data.status==="false"){
                myAlert("同名文件夹已存在");
              }
              else{
                myAlert("新建文件夹失败,请尝试重新登录");
              }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        _this.setState({inputValue: ""});
        _this.props.changeRAlertBlockDisplay(0);
    }
    render(){
        return (
            <div className="RAlertBlock" isdisplay={this.props.isDisplay}>
                <input className="Input" placeholder="文件夹名称" value={this.state.inputValue} onChange={this.handleChangeInput}/>
                <div className="Button" onClick={this.handleClickButton}>确定</div>
            </div>
        );
    }
}

export {RAlertBlock};