import React from 'react';
import './InfoPanel.css'

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

function NextSquare(props){
    const style = {
        background: props.color,
    }

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
    render(){
        return(
            <div className="Info_Board">
                <div className="Info_Section">
                    <div className="Score_Title">점수:</div>
                    <div className="Score_Number">{this.props.score}</div>
                </div>
                <div className="Info_Section">
                    <div className="Stage_Title">단계:</div>
                    <div className="Stage_Number">{this.props.stage}</div>
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