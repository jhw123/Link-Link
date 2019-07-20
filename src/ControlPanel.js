import React from 'react';
import './ControlPanel.css'

class ControlPanel extends React.Component{
    
    onKeyPressed(e) {
        if(e.key === " " || e.keyCode === 32) {
            this.props.SpaceOnClick();
        } else if(e.key === "ArrowRight" || e.keyCode === 39) {
            this.props.RightOnClick();
        } else if(e .key=== "ArrowLeft" || e.keyCode === 37) {
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
            <div
                onKeyDown={(e) => this.onKeyPressed(e)}
            >
                <button
                    className="ControlPanel_key LongKey"
                    onClick={this.props.SpaceOnClick}>
                    ROTATE
                </button>
                {/* <button
                    className="ControlPanel_key LongKey"
                    onClick={this.props.createOnClick}>
                    CREATE
                </button> */}
                <button 
                    className="ControlPanel_key SquareKey" 
                    onClick={this.props.LeftOnClick}>
                    MOVE LEFT
                </button>
                <button
                    className="ControlPanel_key SquareKey"
                    onClick={this.props.DownOnClick}>
                    MOVE DOWN
                </button>
                <button 
                    className="ControlPanel_key SquareKey"
                    onClick={this.props.RightOnClick}>
                    MOVE RIGHT
                </button>
            </div>
        );
    }
}

export default ControlPanel;