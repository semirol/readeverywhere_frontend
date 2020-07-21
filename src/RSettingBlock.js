import React from 'react';

import './RSettingBlock.css';

class RSettingBlock extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="RSettingBlock">
                <div id="Setting" className="Top0Text">
                    <div className="Text">SETTING</div>
                </div>
                <div id="SubSetting0" className="Top1Text">
                    <div className="C0 Text">SUBSETTING0</div>
                </div>
                <div id="SubSetting1" className="Top1Text">
                    <div className="C0 Text">SUBSETTING1</div>
                </div>
            </div>
        );
    }
}

export {RSettingBlock};