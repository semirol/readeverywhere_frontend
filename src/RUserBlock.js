import React from 'react';
import axios from 'axios';
import Qs from 'qs';
import Cookies from 'js-cookie';
import { myAlert } from './RScripts';

import './RUserBlock.css';

class RUserBlock extends React.Component{
    constructor(props) {
        super(props);
        const userEmail = Cookies.get('userEmail');
        const usedSpace = Cookies.get('usedSpace');
        const totalSpace = Cookies.get('totalSpace');
        // const token = Cookies.get('token');
        this.state = {
            email: "",
            password: "",
            userEmail,
            usedSpace,
            totalSpace,
            display: userEmail?0:1,
            signUp: 0,
            emailSignUp: "",
            nameSignUp: "",
            invCodeSignUp: "",
            passwordSignUp: "",
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmailSignUp = this.handleChangeEmailSignUp.bind(this);
        this.handleChangeNameSignUp = this.handleChangeNameSignUp.bind(this);
        this.handleChangeInvCodeSignUp = this.handleChangeInvCodeSignUp.bind(this);
        this.handleChangePasswordSignUp = this.handleChangePasswordSignUp.bind(this);
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleClickLogout = this.handleClickLogout.bind(this);
        this.handleClickSignUp = this.handleClickSignUp.bind(this);
        this.handleClickRefreshInfo = this.handleClickRefreshInfo.bind(this);
        this.doSignUp = this.doSignUp.bind(this);
    }
    handleChangeEmail(event){
        this.setState({email: event.target.value});
    }
    handleChangePassword(event){
        this.setState({password: event.target.value});
    }
    handleChangeEmailSignUp(event){
        this.setState({emailSignUp: event.target.value});
    }
    handleChangeNameSignUp(event){
        this.setState({nameSignUp: event.target.value});
    }
    handleChangeInvCodeSignUp(event){
        this.setState({invCodeSignUp: event.target.value});
    }
    handleChangePasswordSignUp(event){
        this.setState({passwordSignUp: event.target.value});
    }
    handleClickSignUp(){
        this.setState({signUp: 1 - this.state.signUp});
    }
    handleClickLogin(){
        this.doLogin();
    }
    handleClickLogout(){
        this.doLogout();
    }
    handleClickRefreshInfo(){
        let _this = this;
        let token = Cookies.get("token");
        if (token!==''&&token){
            axios({
              method: 'post',
              url: 'http://127.0.0.1:8080/getUserInfo',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'token':token,
              },
            })
            .then(function (response) {
              if (response.data.status==="true"){
                _this.setState({
                    userEmail: response.data.user.email,
                    usedSpace: response.data.user.usedSpace,
                    totalSpace: response.data.user.totalSpace,
                });
                Cookies.set('usedSpace',response.data.user.usedSpace);
                Cookies.set('totalSpace',response.data.user.totalSpace);
                Cookies.set('userEmail',response.data.user.email);
              }
              else{
                myAlert("刷新失败");
              }
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        else{
            myAlert("token失效");
        }
    }
    doSignUp(){
        const _this = this;
        if (_this.state.passwordSignUp.length<8){
            myAlert("密码长度不能小于8位");
            return;
        }
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8080/signUp',
            data: Qs.stringify({
                email:_this.state.emailSignUp,
                name:_this.state.nameSignUp,
                password:_this.state.passwordSignUp,
                invCode:_this.state.invCodeSignUp,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(function (response) {
            if (response.data.status==='true'){
                myAlert("邮件已发送，请查看邮箱并点击验证连接，验证后返回此页面进行登录。")
            }
            else if (response.data.status==='wait'){
                myAlert("60秒内进行过注册操作，请查看邮箱");
            }
            else if (response.data.status==='invCodeError'){
                myAlert("邀请码错误");
            }
            else{
                myAlert('注册失败');
            } 
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    doLogin(){
        const _this = this;
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8080/login',
            data: Qs.stringify({
                email:_this.state.email,
                password:_this.state.password,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(function (response) {
            if (response.data.status==='true'){
                _this.setState({
                    userEmail: response.data.user.email,
                    usedSpace: response.data.user.usedSpace,
                    totalSpace: response.data.user.totalSpace,
                    display: 0,
                });
                Cookies.set('token',response.data.token);
                Cookies.set('usedSpace',response.data.user.usedSpace);
                Cookies.set('totalSpace',response.data.user.totalSpace);
                Cookies.set('userEmail',response.data.user.email);
                _this.props.loadPathTree();
            }
            else{
                myAlert('登录失败');
            } 
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    doLogout(){
        this.setState({userEmail: ""}); 
        const token = Cookies.get('token');
        if (token==''||!token){

        }
        else{
            axios({
                method: 'post',
                url: 'http://127.0.0.1:8080/logout',
                data: '',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'token': token,
                },
            })
        } 
        Cookies.set('token','');
        Cookies.set('userEmail','');
        Cookies.set('usedSpace','');
        Cookies.set('totalSpace','');
        Cookies.set('viewerPath','');
        this.setState({display: 1});
        this.props.loadPathTree();
        this.props.deletePdfAll();
    }
    render() {
        let renderItem;
        let renderItem1;
        let renderItem2;
        if (this.state.display===1){
            renderItem = (
                <>
                    <input className="Input" type="text" placeholder="email" value={this.state.email} 
                        onChange={this.handleChangeEmail}/>
                    <input className="Input" type="password" placeholder="password" value={this.state.password} 
                        onChange={this.handleChangePassword}/>
                </>
            );
            renderItem1 = <>
                <div className="LoginButton Button" onClick={this.handleClickLogin}>登入</div>
                <div className="SignUpInfo Button" onClick={this.handleClickSignUp}>没有账号？注册</div>
            </>;
            renderItem2 = <>
                <input className="Input" type="text" placeHolder="email" value={this.state.emailSignUp} 
                    onChange={this.handleChangeEmailSignUp}/>
                <input id = "nameSignUp" className="Input" type="text" placeHolder="name" value={this.state.nameSignUp} 
                    onChange={this.handleChangeNameSignUp}/>
                <input id = "invCodeSignUp" className="Input" type="text" placeHolder="invitation code" value={this.state.invCodeSignUp} 
                    onChange={this.handleChangeInvCodeSignUp}/>
                <input className="Input" type="password" placeHolder="password" value={this.state.passwordSignUp} 
                    onChange={this.handleChangePasswordSignUp}/>
                <div className="SignUpButton Button" onClick={this.doSignUp}>注册</div>
            </>;
        }
        else{
            renderItem = (
                <div className="RenderItem">
                    <div className="Text">邮箱: {this.state.userEmail}</div><br/>
                    <div className="Text">容量使用情况: {(parseInt(this.state.usedSpace)/1024).toFixed(1)}MB/{(parseInt(this.state.totalSpace)/1024).toFixed(1)}MB</div>
                </div>
            );
            renderItem1 = <div className="LogoutButton Button" onClick={this.handleClickLogout}>登出</div>;
        }
        return (
            <div className="RUserBlock">
                <div className="Top0Text">
                    <div className="Text">USER</div>
                </div>
                <div className="Top1Text">
                    <div className="Information Text C0">INFORMATION</div>
                    {this.state.display!==1?<div className="Refresh Text" onClick={this.handleClickRefreshInfo}>刷</div>:null}
                </div>
                {renderItem}
                <div className="Top1Text">
                    <div className="Text C0">ACTION</div>
                </div>
                {renderItem1}
                {this.state.signUp==1?renderItem2:null}
            </div>
        );
    }
}

export {RUserBlock};