const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

function test(test_name, expectation, test){
    if(expectation === test)
        console.log("PASS");
    else{
        console.log(`FAIL - ${test_name}`);
        console.log(`Expect: ${expectation} but got: ${test}`);
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

test("true case", true, checkLinked({pattern: [UP], color: 'red'}, {pattern: [DOWN, UP], color: 'red'}, UP));
test("different color", false, checkLinked({pattern: [UP], color: 'red'}, {pattern: [DOWN, UP], color: 'yello'}, UP));
test("check_block has no link", false, checkLinked({pattern: [DOWN], color: 'red'}, {pattern: [DOWN, UP], color: 'red'}, UP));
test("adjacent has no link", false, checkLinked({pattern: [UP], color: 'red'}, {pattern: [UP], color: 'red'}, UP));
test("no adjacent block", false, checkLinked({pattern: [UP], color: 'red'}, false, UP));