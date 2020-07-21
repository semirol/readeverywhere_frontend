import React from 'react';
import Cookies from 'js-cookie';

import './RViewer.css';

class RViewer extends React.Component{
    constructor(props){
        super(props);
        this.handleclick0 = this.handleclick0.bind(this);
        this.handleclick1 = this.handleclick1.bind(this);
    }
    handleclick0(index){
        this.props.changeIndex(index);
    }
    handleclick1(p1,p2){
        this.props.deletePdf(p1,p2);
    }
    render(){
        let token = Cookies.get('token');
        let renderButton;
        let renderItem;
        if (token&&token!=''&&this.props.viewerPath&&this.props.viewerPath.length!=0){
            renderButton = this.props.viewerPath.map(
                (item,index) => (
                    <div key={'rb'+item[0]+item[1]} className="TopButton" highlight={this.props.index==index?'true':'false'}>
                        <div key={'vb0'+item[0]+item[1]} className="RenderButton" onClick={()=>this.handleclick0(index)}>{item[0]}</div>
                        <div key={'vb1'+item[0]+item[1]} className="RenderButtonX" onClick={()=>this.handleclick1(item[0],item[1])}>×</div>
                    </div>
                )
            );
            renderItem = this.props.viewerPath.map(
                (item,index) => (
                    index==this.props.index?
                        <iframe key={'iframe'+item[0]+item[1]} src={'./pdfjs/web/viewer.html'+'?file=' 
                        + encodeURIComponent("http://localhost:8080/getPdfStream?token="+token+"&path="+item[0])} 
                        scrolling='no' width='100%' height='100%'></iframe>
                    :
                        <iframe key={'iframe'+item[0]+item[1]} src={'./pdfjs/web/viewer.html'+'?file=' 
                        + encodeURIComponent("http://localhost:8080/getPdfStream?token="+token+"&path="+item[0])} 
                        scrolling='no' width='100%' height='100%' style={{display:'none'}}></iframe>
                )
            );
        }
        else{
            renderItem = <iframe src={'./pdfjs/web/viewer.html'} 
            scrolling='no' width='100%' height='100%'></iframe>
        }
        return (
            <div id="fst" className='RViewer'>
                <div className="TopBar">
                    {renderButton}
                </div>
                {renderItem}
            </div>
        );
    }
}

export {RViewer};