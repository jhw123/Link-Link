import React from 'react';
import './InstructionPanel.css'

class InstuctionPanel extends React.Component{
    render(){
        return(
            <div className="Instruction">
                <h1>게임 방법</h1>
                <div>
                    <img className="Instruction_Img" 
                        src="control.png" 
                        alt="Press 'Spacebar' to rotate a block, Press 'ArrowLeft' to move left, Press 'ArrowRight' to move right."
                    />
                    <div>1. 회전, 좌우 이동을 이용해 떨어지는 블록을 움직이기</div>
                </div>
                <div>
                    <img className="Instruction_Img" 
                        src="chain.png"
                        alt="Link three equal-colored blocks to remove blocks."
                    />
                    <div>2. 3개 이상의 같은 색 블록을 연결하여 블록 없애기</div>
                </div>
                <div>
                    <img className="Instruction_Img" 
                        src="full.png"
                        alt="Obtain scores until your window is full with blocks."
                    />
                    <div>3. 블록이 화면을 모두 채우기까지 점수 얻기!!</div>
                </div>
            </div>
        )
    }
}

export default InstuctionPanel;