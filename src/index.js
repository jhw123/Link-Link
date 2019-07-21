import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ControlPanel from './ControlPanel.js';
import InstructionPanel from './InstructionPanel';
import InfoPanel from './InfoPanel';

const COLUMN_SIZE = 6;
const ROW_SIZE = 8;
const CHAIN_NUM = 3;

const SATURATION = 100;
const LIGHTNESS = 60;
const COLOR_PALLETE = [`hsl(${0}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${120}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${240}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${60}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${180}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${300}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${30}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${90}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${150}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${210}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${270}, ${SATURATION}%, ${LIGHTNESS}%)`,
                        `hsl(${330}, ${SATURATION}%, ${LIGHTNESS}%)`,];

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

function GameOverModal(props) {
    let style={};
    if(props.gameState !== "Over"){
        style={
            display: 'none',
        }
    }
    return(
        <div className="Game_Over" style={style}>
            <div className="Game_Over_Text">GAME OVER!</div>
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        const colorPool = [COLOR_PALLETE[0],COLOR_PALLETE[1]];
        const blockPool = [[DOWN],
                            [RIGHT], 
                            [DOWN, UP], 
                            [RIGHT, DOWN], 
                            [LEFT, RIGHT, DOWN],
                            [LEFT, RIGHT, DOWN, UP]];

        let boxState = [];
        for(let i=0; i<ROW_SIZE; i++){
            boxState.push(Array(COLUMN_SIZE).fill(false));
        }

        this.state = {
            boxState: boxState,
            boxStateLock: false, // this lock is used to avoid sync issues for simultaneous drop and user's DOWN
            currentBox: [0, 0],
            colorPool: colorPool.sort(function() { return 0.5 - Math.random() }),
            colorCount: colorPool.length,
            blockPool: blockPool.sort(function() { return 0.5 - Math.random() }),
            blockCount: blockPool.length,
            score: 0,
            stage: 1,
            targetScore: 50,
            targetScoreIncrease: 50,
            gameState: "Init",
        }
    }

    rotateBlock(x, y, rotateClockwise){
        if(this.state.gameState !== "Running")
            return{};
        
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
        if(this.state.boxStateLock || this.state.gameState !== "Running")
            return{};

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
            this.setState({
                boxStateLock: true,
            });
            const delete_blocks = checkLinkAndReturnBlocksToDelete(x, y, this.state.boxState);
            this.setState(this.raiseScoreAndRaiseStage(Math.pow(delete_blocks.length, 2)));
            this.setState(this.deleteBlocks(delete_blocks), () => {
                const new_x_position = this.getNextDropPosition();
                if(new_x_position === -1){
                    this.gameOver();
                }
                const new_pattern = this.getNextBlock();
                this.setState(this.createNewBlock(0, new_x_position, new_pattern.pattern, new_pattern.color));
                this.setState({
                    boxStateLock: false,
                });
            });
        } else // this is when a moving block collides to a pre-existing block
            return {};
    }

    getNextDropPosition(){
        let cand_pos = []
        this.state.boxState[0].map((square, idx) => {
            if(!square)
                cand_pos.push(idx);
            return idx;
        })
        if(cand_pos.length === 0){ // the condition for game over
            return -1;
        } else {
            return cand_pos[Math.floor(Math.random() * cand_pos.length)];
        }
    }

    getNextBlock(){
        const blockCount = this.state.blockCount;
        const colorCount = this.state.colorCount;
        const color = this.state.colorPool[colorCount-1];
        const pattern = this.state.blockPool[blockCount-1];

        if(blockCount === 1){
            this.setState({
                    blockPool: this.state.blockPool.sort(function() { return 0.5 - Math.random() }),
                    blockCount: this.state.blockPool.length,
            })
        } else {
            this.setState({
                blockCount: blockCount-1,
            })
        }
        if(colorCount === 1){
            this.setState({
                colorPool: this.state.colorPool.sort(function() { return 0.5 - Math.random() }),
                colorCount: this.state.colorPool.length,
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

    deleteBlocks(listOfBlocks){
        const cur_boxState = this.state.boxState;
        let new_boxState = copyBoxState(cur_boxState);

        for(let block of listOfBlocks){
            const [x, y] = block;
            new_boxState[x][y] = false;
        }
        
        return{
            boxState: new_boxState,
        }
    }

    raiseScoreAndRaiseStage(score_to_add){
        const score_added = this.state.score + score_to_add;
        if(this.state.targetScore <= score_added) {
            console.log("level up!");
            return {
                colorPool: [...this.state.colorPool, COLOR_PALLETE[this.state.stage+1]],
                colorCount: this.state.colorPool.length + 1, 
                stage: this.state.stage + 1,
                score: score_added,
                targetScore: this.state.targetScore + this.state.targetScoreIncrease,
                targetScoreIncrease: this.state.targetScoreIncrease + 50,
            }
        } else {
            return {
                score: score_added,
            }
        }
    }

    startGame(){
        const start_x_poistion = Math.floor((Math.random() * COLUMN_SIZE-1) + 1);
        const colorPool = [COLOR_PALLETE[0],COLOR_PALLETE[1]];
        const blockPool = [[DOWN],
                            [RIGHT], 
                            [DOWN, UP], 
                            [RIGHT, DOWN], 
                            [LEFT, RIGHT, DOWN],
                            [LEFT, RIGHT, DOWN, UP]];

        let boxState = [];
        for(let i=0; i<ROW_SIZE; i++){
            boxState.push(Array(COLUMN_SIZE).fill(false));
        }

        boxState[0][start_x_poistion] = {
            color: this.state.colorPool[this.state.colorCount-1], 
            pattern: [DOWN, RIGHT]
        };

        this.setState({
            boxState: boxState,
            boxStateLock: false,
            currentBox: [0, start_x_poistion],
            colorPool: colorPool.sort(function() { return 0.5 - Math.random() }),
            colorCount: colorPool.length,
            blockPool: blockPool.sort(function() { return 0.5 - Math.random() }),
            blockCount: blockPool.length,
            score: 0,
            stage: 1,
            targetScore: 50,
            targetScoreIncrease: 50,
            gameState: "Running",
        }, () => {
            this.interval = setInterval(() => this.tick(), 1000);
        });
    }

    pauseGame(){
        this.setState({
            gameState: "Pause",
        }, () => {
            clearInterval(this.interval);
        })
    }

    resumeGame(){
        this.setState({
            gameState: "Running",
        }, () => {
            this.interval = setInterval(() => this.tick(), 1000);
        })
    }

    gameOver(){
        this.setState({
            gameState: "Over",
        }, () => {
            console.log("GAME OVER!");
            clearInterval(this.interval);
        });
    }

    tick(){
        console.log("tick");
        let [x, y] = this.state.currentBox;
        this.setState(this.moveCurrentBlock(x, y, DOWN));
    }

    // componentDidMount() {
    //     this.interval = setInterval(() => this.tick(), 1000);
    // }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // Handlers for click events
    RotateHandleClick(){
        let [x, y] = this.state.currentBox;
        this.setState(this.rotateBlock(x, y, true));
    }

    MoveHandleClick(direction){
        let [x, y] = this.state.currentBox;
        this.setState(this.moveCurrentBlock(x, y, direction));
    }

    StartHandleClick(){
        clearInterval(this.interval);
        this.startGame(); 
    }

    PauseHandleClick(){
        this.pauseGame();
    }

    ResumeHandleClick(){
        this.resumeGame();
    }

    RetryHandleClick(){
        this.startGame();
    }

    render() {
        let rows = this.state.boxState.map((column, index) => {
            return(<Row columnState={column} key={index}/>);
        })

        return(
            <div>
                <div className="Header">
                    <div className="Logo">
                        <div className="Text">LINK-LINK</div>
                        <div className="RedSquare"></div>
                        <div className="BlueSquare"></div>
                    </div>
                </div>
                <div>
                    <InstructionPanel />
                    <div className="Game_Board">
                        {rows}
                        <GameOverModal 
                            gameState={this.state.gameState}
                        />
                    </div>
                    <InfoPanel 
                        score={this.state.score}
                        stage={this.state.stage}
                        color={this.state.colorPool[this.state.colorCount-1]}
                        pattern={this.state.blockPool[this.state.blockCount-1]}
                        gameState={this.state.gameState}
                        StartOnClick={() => this.StartHandleClick()}
                        PauseOnClick={() => this.PauseHandleClick()}
                        ResumeOnClick={() => this.ResumeHandleClick()}
                        RetryOnClick={() => this.RetryHandleClick()}
                    />
                    <ControlPanel 
                        SpaceOnClick={() => this.RotateHandleClick()}
                        DownOnClick={() => this.MoveHandleClick(DOWN)}
                        LeftOnClick={() => this.MoveHandleClick(LEFT)}
                        RightOnClick={() => this.MoveHandleClick(RIGHT)}
                    />
                </div>
            </div>
        );
    }
}

function checkLinkAndReturnBlocksToDelete(x, y, boxState){
    if(boxState[x][y]){
        let block_to_delete = [];
        let queue = [[x, y]]; // use a queue for Breadth First Search

        let cnt = 0;

        while(queue.length > 0 && cnt < 20){
            const [cur_x, cur_y] = queue.shift();
            const popped_block = boxState[cur_x][cur_y];
            block_to_delete.push([cur_x, cur_y]);

            if(cur_x > 0){
                const up_square = boxState[cur_x-1][cur_y];
                if(checkLinked(popped_block, up_square, UP)){
                    if(!checkArrayIn2DArray(block_to_delete, [cur_x-1, cur_y]))
                        queue.push([cur_x-1, cur_y]);
                }
            }
            if(cur_x < ROW_SIZE-1){
                const down_square = boxState[cur_x+1][cur_y];
                if(checkLinked(popped_block, down_square, DOWN)){
                    if(!checkArrayIn2DArray(block_to_delete, [cur_x+1, cur_y]))
                        queue.push([cur_x+1, cur_y]);
                }
            }
            if(cur_y > 0){
                const left_square = boxState[cur_x][cur_y-1];
                if(checkLinked(popped_block, left_square, LEFT)){
                    if(!checkArrayIn2DArray(block_to_delete, [cur_x, cur_y-1]))
                        queue.push([cur_x, cur_y-1]);
                }
            }
            if(cur_y < COLUMN_SIZE-1){
                const right_square = boxState[cur_x][cur_y+1];
                if(checkLinked(popped_block, right_square, RIGHT)){
                    if(!checkArrayIn2DArray(block_to_delete, [cur_x, cur_y+1]))
                        queue.push([cur_x, cur_y+1]);
                }
            }
            cnt++;
        }

        if(block_to_delete.length >= CHAIN_NUM){
            console.log("chained!", cnt, block_to_delete);
            return block_to_delete;
        } else {
            return [];
        }
    } else {
        throw new Error("Wrong X and Y to check link.");
    }
}

function checkLinked(check_block, adjacent_block, direction){
    const opposite_direction = (direction+2)%4;

    if(check_block.pattern.includes(direction) 
        && adjacent_block
        && adjacent_block.pattern.includes(opposite_direction)
        && check_block.color === adjacent_block.color){
            return true;
    }
    return false;
}

function checkArrayIn2DArray(target_array, check_array){
    for(let cur_array of target_array){
        if(cur_array[0] === check_array[0] && cur_array[1] === check_array[1])
            return true;
    }
    return false;
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
