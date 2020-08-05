import React from 'react';

import './RFileTree.css';

class RFileTree extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.loadPdf = this.loadPdf.bind(this);
        this.handleClickUploadFile = this.handleClickUploadFile.bind(this);
        this.handleClickDeleteFile = this.handleClickDeleteFile.bind(this);
        this.handleClickNewDir = this.handleClickNewDir.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.newDir = this.newDir.bind(this);
        this.state = {
            display:0,
        }
    }
    handleClickUploadFile(){
        this.props.uploadFile(this.props.pathTree.name);
        document.getElementById("UploadFileInput").click();
    }
    handleClickDeleteFile(){
        this.props.deleteFile(this.props.pathTree.name);
    }
    handleClickNewDir(){
        this.props.newDir(this.props.pathTree.name);
    }
    uploadFile(x){
        this.props.uploadFile(this.props.pathTree.name+'/'+x);
    }
    deleteFile(x){
        this.props.deleteFile(this.props.pathTree.name+'/'+x);
    }
    newDir(x){
        this.props.newDir(this.props.pathTree.name+'/'+x);
    }
    componentDidUpdate(){
        if (this.props.pathTree==={}){
            this.setState({display:0});
        }
    }
    handleClick(){
        if (this.props.pathTree.type==='dir'){
            this.changeDisplay();
        }
        else if (this.props.pathTree.type==='pdf'){
            this.props.loadPdf(this.props.pathTree.name);
        }
    }
    changeDisplay(){
        this.setState({display:1-this.state.display});
    }
    loadPdf(x){
        this.props.loadPdf(this.props.pathTree.name+'/'+x);
    }
    render(){
        let renderItem;
        let addButton;
        if (this.props.pathTree.type=='dir'&&this.state.display==1){
            renderItem = this.props.pathTree.data.map(
                (item,index)=>(<RFileTree key={index} pathTree={item} loadPdf={this.loadPdf} 
                    uploadFile={this.uploadFile} deleteFile={this.deleteFile} 
                    newDir={this.newDir} isRoot="false"/>)
            );
        }
        if (this.props.pathTree.type=='dir'){
            addButton = <>
                            <div className="DelButton" key='-2'>
                                <div onClick={this.handleClickNewDir}>新</div>
                            </div>
                            <div className="AddButton" key='-1'>
                                <div onClick={this.handleClickUploadFile}>+</div>
                            </div>
                        </>;
        }
        return (
            <div className='RFileTree'>
                <div className="ButtonContainer">
                    {
                        this.props.isRoot!=="true"?
                        <div className="DelButton" key='-2'>
                            <div onClick={this.handleClickDeleteFile}>删</div>
                        </div>:
                        null
                    }
                    {addButton}
                    <div title={this.props.pathTree.name} className="Button" onClick={this.handleClick}>{this.props.pathTree.name}</div>
                </div>
                {renderItem}
            </div>
        );
    }
}

export {RFileTree};