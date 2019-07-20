import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ControlPanel from './ControlPanel.js'
import { tsMethodSignature } from '@babel/types';

const COLUMN_SIZE = 8;
const ROW_SIZE = 10;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

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
            colorPool: ['hsl(' + Math.floor(Math.random() * 360) + ', 100%, 60%)',
                            'hsl(' + Math.floor(Math.random() * 360) + ', 100%, 60%)',
                            'hsl(' + Math.floor(Math.random() * 360) + ', 100%, 60%)',],
            colorCount: 3,
            blockPool: [[DOWN], 
                                [DOWN, UP], 
                                [LEFT, DOWN], 
                                [LEFT, RIGHT, DOWN], 
                                [LEFT, RIGHT, DOWN, UP]],
            blockCount: 5,
        }

        this.state.boxState[0][0] = {
            color: this.state.colorPool[this.state.colorCount-1], 
            pattern: [DOWN, RIGHT]};
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
        } else if(direction === DOWN) { // when the current block collides bottom
            const new_x_position = Math.floor((Math.random() * COLUMN_SIZE-1) + 1);
            const new_pattern = this.getNextBlock();
            this.setState(this.createNewBlock(0, new_x_position, new_pattern.pattern, new_pattern.color));
        } else // this is when a moving block collides to a pre-existing block
            return {};
    }

    getNextBlock(){
        const blockCount = this.state.blockCount;
        const colorCount = this.state.colorCount;
        const color = this.state.colorPool[colorCount-1];
        const pattern = this.state.blockPool[blockCount-1];

        if(blockCount === 1){
            this.setState({
                    blockPool: this.state.blockPool.sort(function() { return 0.5 - Math.random() }),
                    blockCount: 5,
            })
        } else {
            this.setState({
                blockCount: blockCount-1,
            })
        }
        if(colorCount === 1){
            this.setState({
                colorPool: this.state.colorPool.sort(function() { return 0.5 - Math.random() }),
                colorCount: 3,
            })
        } else {
            this.setState({
                colorCount: colorCount-1,
            })  
        }

        return {
            pattern: pattern,
            color: color,
        }
    }

    createNewBlock(x, y, pattern, color){
        const cur_boxState = this.state.boxState;
        let new_boxState = copyBoxState(cur_boxState);

        const new_color = 'hsl(' + Math.floor(Math.random() * 360) + ', 100%, 60%)';

        if(!cur_boxState[x][y]){ //check if the position is occupied by another block
            new_boxState[x][y] = {
                color: color,
                pattern: pattern,
            }
            return{
                boxState: new_boxState,
                currentBox: [x, y],
            }
        } else
            return {};
    }

    tick(){
        console.log("tick");
        let [x, y] = this.state.currentBox;
        this.setState(this.moveCurrentBlock(x, y, DOWN));
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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
        let pattern = [DOWN, UP];
        this.setState(this.createNewBlock(0, 0, pattern));
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
