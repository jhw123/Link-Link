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

class InfoPanel extends React.Component{
    render(){
        return(
            <div className="Info_Board">
                <div className="Info_Section">
                    <div className="Score_Title">스코어:</div>
                    <div className="Score_Number">{this.props.score}</div>
                </div>
                <div className="Info_Section">
                    <div className="Stage_Title">스테이지:</div>
                    <div className="Stage_Number">{this.props.stage}</div>
                </div>
                <div className="Info_Section">
                    <div className="Next_Title">다음 블록:</div>
                    <NextSquare 
                        color={this.props.color} 
                        pattern={this.props.pattern}/>
                </div>
            </div>
        )
    }
}

export default InfoPanel;