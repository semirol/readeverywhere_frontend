import React from 'react';

import './RSelectTool.css';

class RSelectTool extends React.Component{
    constructor(props){
        super(props);
        this.toggleFullScreen = this.toggleFullScreen.bind(this);
        this.fullScreen = this.fullScreen.bind(this);
    }
    fullScreen(el) {
        var isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        if (!isFullscreen) { //进入全屏,多重短路表达式
            (el.requestFullscreen && el.requestFullscreen()) ||
            (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
            (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) || (el.msRequestFullscreen && el.msRequestFullscreen());
    
        } else { //退出全屏,三目运算符
            let res = document.exitFullscreen ? document.exitFullscreen() :
            document.mozCancelFullScreen ? document.mozCancelFullScreen() :
            document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
        }
    }
    toggleFullScreen() {
        let el = document.getElementById("fst");
        // var el = e.srcElement || e.target; //target兼容Firefox
        // el.innerHTML == '禅' ? el.innerHTML = '禅' : el.innerHTML = '禅';
        this.fullScreen(el);
    }
    render(){
        return (
            <div className="RSelectTool">
                <div className="User Item" highlight={this.props.selectToolIndex==0?'true':'false'} 
                onClick={()=>this.props.changeSelectToolIndex(0)}>用户</div>
                <div className="File Item" highlight={this.props.selectToolIndex==1?'true':'false'} 
                onClick={()=>this.props.changeSelectToolIndex(1)}>文件</div>
                <div className="Setting Item" highlight={this.props.selectToolIndex==2?'true':'false'} 
                onClick={()=>this.props.changeSelectToolIndex(2)}>设置</div>
                <div className="Zen Item" highlight={this.props.selectToolIndex==3?'true':'false'} 
                onClick={()=>this.toggleFullScreen()}>禅</div>
            </div>
        );
    }
}

export {RSelectTool};