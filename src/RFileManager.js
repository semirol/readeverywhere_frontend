import React from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
import {RFileTree} from './RFileTree';

import './RFileManager.css';

class RFileManager extends React.Component{
    constructor(props){
        super(props);
    }
    handleclick0(index){
        this.props.changeIndex(index);
    }
    handleclick1(p1,p2){
        this.props.deletePdf(p1,p2);
    }
    render(){
        let renderItem = this.props.viewerPath.map(
                (item,index)=>(
                    <div key={'fb'+item[0]+item[1]} className="RenderItem" highlight={this.props.index==index?'true':'false'}>
                        <div key={'fb1'+item[0]+item[1]} className="RenderButtonX Text" onClick={()=>this.handleclick1(item[0],item[1])}>
                            ×
                        </div>
                        <div title={item[0]} key={'fb0'+item[0]+item[1]} className="RenderButton Text" onClick={()=>this.handleclick0(index)}>
                            {item[0].split('/').slice(1).join('/')}
                        </div>
                    </div>                
                )
            );
        return (
            <div className='RFileManager'>
                <div id="Explorer" className="Top0Text">
                    <div className="Text">EXPLORER</div>
                </div>
                <div id="OpenFiles" className="Top1Text">
                    <div className="C0 Text">OPEN FILES</div>
                </div>
                {renderItem}
                <div id="OnlineFiles" className="Top1Text">
                    <div className="C0 Text">ONLINE FILES</div>
                    <div className="Refresh Text" onClick={this.props.loadPathTree}>刷</div>
                </div>
                <RFileTree pathTree={this.props.pathTree} loadPdf={this.props.loadPdf} 
                uploadFile={this.props.uploadFile} deleteFile={this.props.deleteFile}
                newDir={this.props.newDir} isRoot="true"/>
            </div>
        );
    }
}

export {RFileManager};