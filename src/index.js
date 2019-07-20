import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ControlPanel from './ControlPanel.js'

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const COLUMN_SIZE = 8;
const ROW_SIZE = 10;

function Square(props) {
    if(props.blockState) {
        const color = props.blockState.color;
        const pattern = props.blockState.pattern;

        const style = {
            background: color,
        }

        const link = pattern.map((patt) => {
            return(
                <div className={"Square_Box_Link "+convertNumberToDirection(patt)}
                    style={style}
                    key={patt}
                />
            );
        })

        return(
            <div className="Square_Box">
                <div className="Square_Box-Filled" 
                    style={style}
                />
                {link}
            </div>
        );
    } else {
        return(
            <div className="Square_Box"></div>
        );
    }
}

function convertNumberToDirection(number){
    if(number === UP)
        return "UP";
    else if(number === RIGHT)
        return "RIGHT";
    else if(number === DOWN)
        return "DOWN";
    else if(number === LEFT)
        return "LEFT";
    throw new Error();
}

function Row(props) {
    let squares = props.columnState.map((value, index) => {
        return(<Square blockState={value} key={index}/>);
    })

    return(
        <div className="Row">{squares}</div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        let boxState = [];
        for(let i=0; i<ROW_SIZE; i++){
            boxState.push(Array(COLUMN_SIZE).fill(false));
        }

        this.state = {
            boxState: boxState,
            currentBox: [0, 0],
        }

        this.state.boxState[0][0] = {color: "red", pattern: [DOWN, UP]};
        this.state.boxState[ROW_SIZE-1][COLUMN_SIZE-1] = {color: "green", pattern: [UP, LEFT]};
    }

    rotateBlock(x, y, rotateClockwise){
        const cur_boxState = this.state.boxState;
        let new_boxState = copyBoxState(cur_boxState);

        let new_pattern = cur_boxState[x][y].pattern.map((direction) => {
            return (direction+(rotateClockwise? 1 : -1))%4;
        })

        new_boxState[x][y].pattern = new_pattern;

        return{
            boxState: new_boxState,
        };
    } 

    moveCurrentBlock(x, y, direction){
        const cur_boxState = this.state.boxState;
        let new_boxState = copyBoxState(cur_boxState);

        let new_x = x + ((direction+1)%2? direction-1 : 0);
        let new_y = y + (direction%2? -1*(direction-2) : 0);

        new_x = Math.max(0, Math.min(ROW_SIZE-1, new_x));
        new_y = Math.max(0, Math.min(COLUMN_SIZE-1, new_y));

        if(!cur_boxState[new_x][new_y]){ //check if the new position is occupied by another block
            new_boxState[x][y] = false;
            new_boxState[new_x][new_y] = this.state.boxState[x][y];

            return{
                boxState: new_boxState,
                currentBox: [new_x, new_y],
            };
        } else // this is when a moving block collides to a pre-existing block
            return {};
    }

    createNewBlock(x, y, pattern){
        const cur_boxState = this.state.boxState;
        let new_boxState = copyBoxState(cur_boxState);

        const new_color = 'hsl(' + Math.floor(Math.random() * 360) + ', 100%, 60%)';

        if(!cur_boxState[x][y]){ //check if the position is occupied by another block
            new_boxState[x][y] = {
                color: new_color,
                pattern: pattern,
            }
            return{
                boxState: new_boxState,
                currentBox: [x, y],
            }
        } else
            return {};
    }

    RotateHandleClick(){
        let [x, y] = this.state.currentBox;
        this.setState(this.rotateBlock(x, y, true));
    }

    MoveHandleClick(direction){
        let [x, y] = this.state.currentBox;
        this.setState(this.moveCurrentBlock(x, y, direction));
    }

    CreateHandleClick(){
        this.setState(this.createNewBlock(0, 0, [DOWN, UP]));
    }

    render() {
        let rows = this.state.boxState.map((column, index) => {
            return(<Row columnState={column} key={index}/>);
        })

        return(
            <div>
                <div className="Game_Board">{rows}</div>
                <ControlPanel 
                    SpaceOnClick={() => this.RotateHandleClick()}
                    createOnClick={() => this.CreateHandleClick()}
                    DownOnClick={() => this.MoveHandleClick(DOWN)}
                    LeftOnClick={() => this.MoveHandleClick(LEFT)}
                    RightOnClick={() => this.MoveHandleClick(RIGHT)}
                />
            </div>
        );
    }
}

function copyBoxState(boxState){
    let new_boxState = [];
    for(let row of boxState){
        new_boxState.push(row.slice());
    }
    return new_boxState;
}

ReactDOM.render(
    <Game />, 
    document.getElementById('root')
);
