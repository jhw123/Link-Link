import React from 'react';
import './ControlPanel.css'

class ControlPanel extends React.Component{
    
    onKeyDown(e) {
        if(e.key === " " || e.keyCode === 32) {
            this.props.SpaceOnClick();
        } else if(e.key === "ArrowRight" || e.keyCode === 39) {
            this.props.RightOnClick();
        } else if(e.key === "ArrowLeft" || e.keyCode === 37) {
            this.props.LeftOnClick();
        } else if(e.key === "ArrowDown" || e.keyCode === 40) {
            this.props.DownOnClick();
        } else
            console.log(e.key, e.keyCode);
        e.preventDefault();
        return;
    }

    render(){
        return(
            <div className="ControlPanel">
                <div>
                    <div className="ControlPanel_Text">블록 회전</div>
                    <button
                        className="ControlPanel_key LongKey"
                        onClick={this.props.SpaceOnClick}>
                        SPACEBAR
                    </button>
                </div>
                <div>
                    <div className="ControlPanel_Text">좌로 이동</div>
                    <button 
                        className="ControlPanel_key SquareKey" 
                        onClick={this.props.LeftOnClick}>
                        ⬅
                    </button>
                </div>
                <div>
                    <div className="ControlPanel_Text">내리기</div>
                    <button
                        className="ControlPanel_key SquareKey"
                        onClick={this.props.DownOnClick}>
                        ⬇
                    </button>
                </div>
                <div>
                    <div className="ControlPanel_Text">우로 이동</div>
                    <button 
                        className="ControlPanel_key SquareKey"
                        onClick={this.props.RightOnClick}>
                        ➡
                    </button>
                </div>
            </div>
        );
    }
}

export default ControlPanel;