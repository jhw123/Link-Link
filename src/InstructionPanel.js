import React from 'react';
import './InstructionPanel.css'

class InstuctionPanel extends React.Component{
    render(){
        return(
            <div className="Instruction">
                <h1>게임 방법</h1>
                <ol>
                    <li>
                        <div>회전, 좌우 이동을 이용해 떨어지는 블록을 움직이기</div>
                        <img className="Instruction_Img" src="control.png"/>
                    </li>
                    <li>
                        <div>3개 이상의 같은 색 블록을 연결하여 블록 없애기</div>
                        <img className="Instruction_Img" src="chain.png"/>
                    </li>
                    <li>
                        <div>블록이 화면을 모두 채우기까지 점수 얻기!!</div>
                    </li>
                </ol>
            </div>
        )
    }
}

export default InstuctionPanel;