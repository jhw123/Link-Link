const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

let TEST_NUM = 1;

const TERMINAL_RESET = '\x1b[0m';
const TERMINAL_RED = '\x1b[31m';
const TERMINAL_GREEN = '\x1b[32m';
const TERMINAL_YELLOW = '\x1b[33m';
const TERMINAL_CYAN = '\x1b[36m';
const TERMINAL_BLUE = '\x1b[34m';

function test(test_name, expectation, func, args){
    const test_val = func(...args);
    if(expectation === test_val)
        console.log(`${TEST_NUM}. ${TERMINAL_GREEN}PASS${TERMINAL_RESET} - ${TERMINAL_YELLOW}${func.name}${TERMINAL_RESET}`);
    else{
        console.log(`${TEST_NUM}. ${TERMINAL_RED}FAIL${TERMINAL_RESET} - ${TERMINAL_YELLOW}${func.name}${TERMINAL_RESET} - ${test_name}`);
        console.log(`${TERMINAL_CYAN}Expect:${TERMINAL_RESET} ${expectation} ${TERMINAL_CYAN}but got:${TERMINAL_RESET} ${test_val}`);
    }
    TEST_NUM++;
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

test("true case for UP", true, checkLinked, [{pattern: [UP], color: 'red'}, {pattern: [DOWN, UP], color: 'red'}, UP]);
test("true case for DOWN", true, checkLinked, [{pattern: [DOWN], color: 'red'}, {pattern: [DOWN, UP], color: 'red'}, DOWN]);
test("true case for LEFT", true, checkLinked, [{pattern: [LEFT, RIGHT], color: 'red'}, {pattern: [RIGHT, DOWN, UP], color: 'red'}, LEFT]);
test("true case for RIGHT", true, checkLinked, [{pattern: [RIGHT, UP, LEFT], color: 'red'}, {pattern: [LEFT, DOWN, UP], color: 'red'}, RIGHT]);
test("different color", false, checkLinked, [{pattern: [UP], color: 'red'}, {pattern: [DOWN, UP], color: 'yello'}, UP]);
test("check_block has no link", false, checkLinked, [{pattern: [DOWN], color: 'red'}, {pattern: [DOWN, UP], color: 'red'}, UP]);
test("adjacent has no link", false, checkLinked, [{pattern: [UP], color: 'red'}, {pattern: [UP], color: 'red'}, UP]);
test("no adjacent block", false, checkLinked, [{pattern: [UP], color: 'red'}, false, UP]);

test("these is a duplicate", true, checkArrayIn2DArray, [[[8, 0],[9, 0],[8, 1],[9, 1]], [9,1]]);
test("these is no duplicate", false, checkArrayIn2DArray, [[[8, 0],[9, 0],[8, 1]], [9,1]]);