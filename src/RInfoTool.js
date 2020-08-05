import React from 'react';
import { RUserBlock } from './RUserBlock';
import { RFileManager } from './RFileManager';
import { RSettingBlock } from './RSettingBlock';

import './RInfoTool.css';

class RInfoTool extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="RInfoTool">
                <div className="IfDisplay" ifdisplay={this.props.selectToolIndex==0?'true':'false'}>
                    <RUserBlock loadPathTree={this.props.loadPathTree} deletePdfAll={this.props.deletePdfAll}/>
                </div>
                <div className="IfDisplay" ifdisplay={this.props.selectToolIndex==1?'true':'false'}>
                    <RFileManager loadPdf={this.props.loadPdf} changeIndex={this.props.changeIndex}
                    deletePdf={this.props.deletePdf} viewerPath={this.props.viewerPath} index={this.props.index}
                    pathTree={this.props.pathTree} loadPathTree={this.props.loadPathTree} 
                    uploadFile={this.props.uploadFile} deleteFile={this.props.deleteFile}
                    newDir={this.props.newDir}/>
                </div>
                <div className="IfDisplay" ifdisplay={this.props.selectToolIndex==2?'true':'false'}>
                    <RSettingBlock/>
                </div>
            </div>
        );
    }
}

export {RInfoTool};