
const tiles = [];

let grid = [];

const dimension = 10;

const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

const rules = [
    [
        [BLANK, UP],
        [BLANK, RIGHT],
        [BLANK,DOWN],
        [BLANK, LEFT],
    ],
    [
        [RIGHT, LEFT, DOWN],
        [DOWN, LEFT, UP],
        [BLANK, DOWN],
        [RIGHT, DOWN, UP],
    ],
    [
        [DOWN, LEFT, RIGHT],
        [UP, DOWN, LEFT],
        [LEFT, RIGHT, UP],
        [BLANK, LEFT],
    ],
    [
        [BLANK, UP],
        [UP, DOWN, LEFT],
        [LEFT, RIGHT, UP],
        [DOWN, RIGHT, UP],
    ],
    [
        [LEFT, DOWN, RIGHT],
        [BLANK, RIGHT],
        [LEFT, RIGHT, UP],
        [RIGHT, DOWN, UP],
    ],
]

function preload() {
    tiles[0] = loadImage("tiles/blank.png");
    tiles[1] = loadImage("tiles/up.png");
    tiles[2] = loadImage("tiles/right.png");
    tiles[3] = loadImage("tiles/down.png");
    tiles[4] = loadImage("tiles/left.png");
}

function setup() {
    createCanvas(800,800);
    
    for (let i = 0; i < dimension*dimension; i++) {
        grid[i] = {
            collapsed: false,
            options: [BLANK,UP,RIGHT,DOWN,LEFT],
        };
    }
}

function checkValid(arr, valid) {
    for (let i = arr.length - 1; i >=0; i--) {
        if (!valid.includes(arr[i])) {
            arr.splice(i, 1);
        }
    }
}
function mousePressed() {
    redraw();
}
function draw() {
    background(0);
    const w = width / dimension;
    const h = height / dimension;
    for(let j =0; j < dimension; j++) {
        for (let i = 0; i < dimension; i++) {
            let cell = grid[i+j*dimension];
            if (cell.collapsed) {
                let index = cell.options[0];
                image(tiles[index], i*w, j*h, w, h);
            }
            else {
                fill(0);
                stroke(255)
                rect(i * w, j * h, w, h);
            }
        }
    }
    let gridCopy = grid.slice();
    gridCopy = gridCopy.filter((a) => !a.collapsed);
    if (gridCopy.length == 0) {
        return;
    }
    gridCopy.sort((a,b) => {
        return a.options.length - b.options.length;
    });
    let len = gridCopy[0].options.length;
    let stopIndex = 0;
    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i;
            break;
        }
    }
    if (stopIndex > 0) {
       gridCopy.splice(stopIndex); 
    }

    const cell = random(gridCopy);
    cell.collapsed = true;
    const pick = random(cell.options);
    cell.options = [pick];

    

    const nextGrid = [];
    for (let j = 0; j < dimension; j++) {
        for (let i = 0; i < dimension; i++) {
            let index = i + j * dimension;
            if (grid[index].collapsed) {
                nextGrid[index] = grid[index];
            } else {
                let options = [BLANK, UP, RIGHT, DOWN, LEFT];
                //Look up
                if (j > 0) {
                  let up = grid[ i + (j - 1) * dimension];  
                  let validOptions = [];
                  for (let option of up.options) {
                    
                    let valid = rules[option][2];
                    validOptions = validOptions.concat(valid);
                  }
                  checkValid(options, validOptions);
                }
                //Look right
                if (i < dimension - 1) {
                    let right = grid[ i + 1 + j * dimension]; 
                    let validOptions = [];
                    for (let option of right.options) {
                      let valid = rules[option][3];
                      validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                //Look down
                if (j < dimension - 1) {
                    let down = grid[ i + (j + 1) * dimension];  
                    let validOptions = [];
                    for (let option of down.options) {
                      let valid = rules[option][0];
                      validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                if (i > 0) {
                    let left = grid[ i - 1 + j * dimension]; 
                    let validOptions = []; 
                    for (let option of left.options) {
                      
                      let valid = rules[option][1];
                      validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                nextGrid[index] = {
                    options,
                    collapsed: false
                };
            }

        }
    }

    grid = nextGrid;

}

