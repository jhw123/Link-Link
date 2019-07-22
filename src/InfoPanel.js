import React from 'react';
import './InfoPanel.css';
import './GameEffect.css';

function convertNum2Dir(number){
    if(number === 0)
        return "UP";
    else if(number === 1)
        return "RIGHT";
    else if(number === 2)
        return "DOWN";
    else if(number === 3)
        return "LEFT";
    throw new Error();
}

function NumberBox(props){
    if(props.highlightOn){
        return(
            <div className="Number_Box">
                {props.number}
                <svg className="BorderHighlight" width="65" height="65">
                    <polygon points="0,0 65,0 65,65 0,65" />
                </svg>
            </div>
        );
    } else { 
        return(
            <div className="Number_Box">
                {props.number}
            </div>
        );
    }
}

function NextSquare(props){
    const style = {
        background: props.color,
    }

    // check if there is no next block. This happens when the page initializes
    if(!props.pattern || !props.color) {
        console.log("No next block");
        return(
            <div className="Next_Box" />
        );
    } else {
        // Create link elements
        const link = props.pattern.map((patt) => {
            return(
                <div className={"Next_Box_Link "+convertNum2Dir(patt)}
                    style={style}
                    key={patt}
                />
            );
        })

        return(
            <div className="Next_Box">
                <div className="Next_Box-Filled" style={style}></div>
                {link}
            </div>
        );
    }
}

function StateButton(props){
    if(props.gameState === "Init") {
        return(
            <button 
                className="START_btn"
                onClick={props.StartOnClick}>시작</button> 
        )
    } else if(props.gameState === "Running") {
        return(
            <button 
                className="PAUSE_btn"
                onClick={props.PauseOnClick}>일시정지</button>
        )
    } else if(props.gameState === "Pause") {
        return(
            <button 
                className="RESUME_btn"
                onClick={props.ResumeOnClick}>계속하기</button>
        )
    } else if(props.gameState === "Over") {
        return(
            <button 
                className="RETRY_btn"
                onClick={props.RetryOnClick}>재시작</button>
        )
    } else
        return(<div>GAME STATE UNKNOWN</div>);
}

class InfoPanel extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            stageHighlight: false,
            scoreHighlight: false,
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stage !== prevProps.stage) {
            this.setState({
                stageHighlight: true,
            }, () => {
                this.offHighlightInSeconds("stage", 3);
            })
        }
    }

    offHighlightInSeconds(scoreOrStage, time){
        if(this.state[`${scoreOrStage}Highlight`]){
            setTimeout(() => {
                this.setState({
                    [`${scoreOrStage}Highlight`]: false,
                })
            }, time*1000);
        }
    }

    render(){

        return(
            <div className="Info_Board">
                <div className="Info_Section">
                    <div className="Score_Title">점수:</div>
                    <NumberBox 
                        highlightOn={this.state.scoreHighlight}
                        number={this.props.score}
                    />
                </div>
                <div className="Info_Section">
                    <div className="Stage_Title">단계:</div>
                    <NumberBox 
                        highlightOn={this.state.stageHighlight}
                        number={this.props.stage}
                    />
                </div>
                <div className="Info_Section">
                    <div className="Next_Title">다음 블록:</div>
                    <NextSquare 
                        color={this.props.color} 
                        pattern={this.props.pattern}/>
                </div>
                <div className="Info_Section">
                    <StateButton 
                        gameState={this.props.gameState}
                        StartOnClick={this.props.StartOnClick}
                        PauseOnClick={this.props.PauseOnClick}
                        ResumeOnClick={this.props.ResumeOnClick}
                        RetryOnClick={this.props.RetryOnClick}
                    />
                </div>
            </div>
        )
    }
}

export default InfoPanel;