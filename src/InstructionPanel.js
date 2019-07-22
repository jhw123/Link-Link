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
                    <div num="1.">회전, 좌우 이동을 이용해 떨어지는 블록을 움직이세요.</div>
                </div>
                <div>
                    <img className="Instruction_Img" 
                        src="chain.png"
                        alt="Link three equal-colored blocks to remove blocks."
                    />
                    <div num="2.">3개 이상의 같은 색 블록을 연결하여 블록 없애세요. 한번에 더 많은 블록을 없앨수록 높은 점수를 얻습니다.</div>
                </div>
                <div>
                    <img className="Instruction_Img" 
                        src="full.png"
                        alt="Obtain scores until your window is full with blocks."
                    />
                    <div num="3.">블록이 화면을 모두 채우기까지 최대한 많은 점수 얻어보세요!!</div>
                </div>
            </div>
        )
    }
}

export default InstuctionPanel;