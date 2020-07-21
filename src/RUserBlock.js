import React from 'react';
import axios from 'axios';
import Qs from 'qs';
import Cookies from 'js-cookie';

import './RUserBlock.css';

class RUserBlock extends React.Component{
    constructor(props) {
        super(props);
        const userEmail = Cookies.get('userEmail');
        // const token = Cookies.get('token');
        this.state = {
            email: "350395090@qq.com",
            password: "jlccdsw1",
            userEmail,
            display: userEmail?0:1,
            signUp: 0,
            emailSignUp: "",
            nameSignUp: "",
            passwordSignUp: "",
            ifcheck: 0,
        };
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmailSignUp = this.handleChangeEmailSignUp.bind(this);
        this.handleChangeNameSignUp = this.handleChangeNameSignUp.bind(this);
        this.handleChangePasswordSignUp = this.handleChangePasswordSignUp.bind(this);
        this.handleClickLogin = this.handleClickLogin.bind(this);
        this.handleClickLogout = this.handleClickLogout.bind(this);
        this.handleClickSignUp = this.handleClickSignUp.bind(this);
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
    doSignUp(){
        const _this = this;
        if (_this.state.passwordSignUp.length<8){
            alert("密码长度不能小于8位");
            return;
        }
        axios({
            method: 'post',
            url: 'http://127.0.0.1:8080/signUp',
            data: Qs.stringify({
                email:_this.state.emailSignUp,
                name:_this.state.nameSignUp,
                password:_this.state.passwordSignUp,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
        .then(function (response) {
            if (response.data.status==='true'){
                _this.setState({
                    ifcheck: 1,
                });
            }
            else if (response.data.status==='wait'){
                alert("60秒内进行过注册操作，请查看邮箱");
            }
            else{
                alert('注册失败');
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
                    display: 0,
                });
                Cookies.set('token',response.data.token);
                Cookies.set('userEmail',response.data.user.email);
                _this.props.loadPathTree();
            }
            else{
                alert('登录失败');
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
        Cookies.set('viewerPath','');
        this.setState({display: 1});
        this.props.loadPathTree();
        this.props.deletePdfAll();
    }
    render() {
        let renderItem;
        let renderItem1;
        let renderItem2;
        let renderItem3;
        if (this.state.display===1){
            renderItem = (
                <>
                    <input className="Input" type="text" placeholder="email" value={this.state.email} 
                        onChange={this.handleChangeName}/>
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
                <input className="Input" type="password" placeHolder="password" value={this.state.passwordSignUp} 
                    onChange={this.handleChangePasswordSignUp}/>
                <div className="SignUpButton Button" onClick={this.doSignUp}>注册</div>
            </>;
            renderItem3 = <div id="CheckInfo" className="Text">邮件已发送，请查看邮箱并点击验证连接，验证后返回此页面进行登录。</div>;
        }
        else{
            renderItem = (
                <div className="RenderItem">
                    <div className="Text">邮箱: {this.state.userEmail}</div><br/>
                    <div className="Text">容量使用情况: 3M/100M</div>
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
                    <div className="Text C0">INFOMATION</div>
                </div>
                {renderItem}
                <div className="Top1Text">
                    <div className="Text C0">ACTION</div>
                </div>
                {renderItem1}
                {this.state.signUp==1?renderItem2:null}
                {this.state.ifcheck==1&&this.state.signUp==1?renderItem3:null}
            </div>
        );
    }
}

export {RUserBlock};