(() => {
 let canvas = document.getElementById('display');
 let display = canvas.getContext('2d');
 let board;
 let nextBoard;
 let boardRules;
 let tmp;
 let cache = {};
 let imageData;
 function count_live_neighbours() {
 }
 function should_cell_survive(x, y, n) {
  return boardRules[y][x].survival.includes(n) || Math.random() > 0.999;
  //let nn = 1 << n;
  //return (nn & boardRules[y][x] >> 9) > 0;
  //return (n === 2 || n === 3);
 }
 function should_cell_be_born(x, y, n) {
  return boardRules[y][x].birth.includes(n) || Math.random() > 0.999;
  //let nn = 1 << n;
  //return (nn & boardRules[y][x]) > 0;
  //return (n === 3);
 }
 function draw_board(board) {
  const width = board[0].length;
  const height = board.length;
  let myImageData = display.getImageData(0, 0, width, height);
  let data = myImageData.data;
  board.forEach((row, y) => {
   row.forEach((cell, x) => {
    let pixelId = (y * width * 4 + x * 4);
    if (cell) {
     data[pixelId] = 0;
     data[pixelId + 1] = 0;
     data[pixelId + 2] = 0;
     data[pixelId + 3] = 255;
    } else {
     data[pixelId] = 255;
     data[pixelId + 1] = 255;
     data[pixelId + 2] = 255;
     data[pixelId + 3] = 255;
    }
   });
  });
  display.putImageData(myImageData, 0, 0);
 }
 function draw_board_(board) {
  const first_row = board[1];
  const width = first_row.length - 2;
  const height = board.length - 2;
  let data = imageData.data;
  for (let y = 1; y < height + 1; ++y) {
   for (let x = 1; x < width + 1; ++x) {
    let pixelId = ((y - 1) * width * 4 + (x - 1) * 4);
    let cell = board[y][x];
    let rules = boardRules[y][x].bits;
    let rulesR = rules >> 12;
    let rulesG = rules >> 6 & 0b000000111111;
    let rulesB = rules & 0b000000000000111111;
    //111111
    //111111
    //111111
    if (cell) {
     data[pixelId] = rulesR << 2;
     data[pixelId + 1] = rulesG << 2;
     data[pixelId + 2] = rulesB << 2;
     data[pixelId + 3] = Math.random() * 100 + 155;
    } else {
     data[pixelId] = rulesR;
     data[pixelId + 1] = rulesG;
     data[pixelId + 2] = rulesB;
     data[pixelId + 3] = Math.random() * 10 + 245;
    }
   }
  }
  display.putImageData(imageData, 0, 0);
 }
 function advance_board_(board, nextBoard) {
  const first_row = board[1];
  const width = first_row.length - 2;
  const height = board.length - 2;
  // toroidal
  for (let y = 1; y < height + 1; ++y) {
   let row = board[y];
   row[0] = row[width];
   row[width + 1] = row[1];
  }
  board[0] = board[height];
  board[height + 1] = board[1];
  for (let y = 1; y < height + 1; ++y) {
   let row = board[y];
   let prev_row = board[y - 1];
   let next_row = board[y + 1];
   for (let x = 1; x < width + 1; ++x) {
    let cell = row[x];
    let prev_x = x - 1;
    let next_x = x + 1;
    let n = prev_row[prev_x] + prev_row[x] + prev_row[next_x]
     + row[prev_x] + row[next_x]
     + next_row[prev_x] + next_row[x] + next_row[next_x];
    if (cell) {
     nextBoard[y][x] = should_cell_survive(x, y, n);
    } else nextBoard[y][x] = should_cell_be_born(x, y, n);
   }
  }
 }
 function advance(board) {
  const first_row = board[0];
  const width = first_row.length;
  const height = board.length;
  const last_row = board[height - 1];
  // EMPTY EDGE
  //let empty_row = cache.empty_row || (cache.empty_row = board[0].map(() => false));
  //let extended_board = [empty_row].concat(board).concat([empty_row])
  //	.map((row) => [false].concat(row).concat([false]));
  // FULL EDGE
  let full_row = cache.full_row || (cache.full_row = board[0].map(() => true));
  let extended_board = [full_row].concat(board).concat([full_row])
   .map((row) => [true].concat(row).concat([true]));
  // TOROIDAL
  //let extended_board = [last_row].concat(board).concat([first_row])
  //	.map((row) => [row[width - 1]].concat(row).concat([row[0]]));
  return extended_board.slice(1, height + 1).map((row, y) => {
   y += 1;
   let prev_row = extended_board[y - 1];
   let next_row = extended_board[y + 1];
   return row.slice(1, width + 1).map((cell, x) => {
    x += 1;
    let prev_x = x - 1;
    let next_x = x + 1;
    let n = prev_row[prev_x] + prev_row[x] + prev_row[next_x]
     + row[prev_x] + row[next_x]
     + next_row[prev_x] + next_row[x] + next_row[next_x];
    if (cell) {
     return should_cell_survive(n);
    } else return should_cell_be_born(n);
   });
  });
 }
 function tick_() {
  requestAnimationFrame(tick_);
  draw_board_(board);
  advance_board_(board, nextBoard);
  tmp = board;
  board = nextBoard;
  nextBoard = tmp;
 }
 function draw() {
  draw_board(board);
  board = advance(board);
  requestAnimationFrame(draw);
 }
 function initialize_board(width, height) {
  board = Array(height + 2).fill(0).map((row, y) => {
   return Array(width + 2).fill(0).map((cell, x) => {
    return Math.random() > 0.5;
   });
  });
  nextBoard = Array(height + 2).fill(0).map((row, y) => {
   return Array(width + 2).fill(false);
  });
  boardRules = Array(height + 2).fill(0).map((row, y) => {
   //return Array(width + 2).fill(0b00000000000000000001100000001000);
   //return Array(width + 2).fill({survival: [2, 3], birth: [3, 6], bits: 0b00000000000000000001100001001000});
   return Array(width + 2).fill({survival: [2, 3], birth: [3, 6], bits: (0b00000000000000010101100001101010)});
   //let test = BIN_RULES(000001100,001001000);
   //let test = BIN_RULES(000,001,100,,001,001,000);
   //let test = BIN_B(000,001,100)BIN_S(001,001,000);
  });
 }
 const run = () => {
  const width = (window.innerWidth / 8) | 0;
  const height = (window.innerHeight / 8) | 0;
  canvas.width = width;
  canvas.height = height;
  imageData = display.getImageData(0, 0, width, height);
  let data = imageData.data;
  for (let i = 3; i < data.length; i += 4) {
   data[i] = Math.random() * 10 + 245;
  }
  initialize_board(width, height);
  // random initial
  //	also with time -- randomize for 1 second in parallel with running the sim
  // big bang initial
  //	also animated
  // 	x^2 + y^2 < r^2
  // edges: empty, full, toroidal
  requestAnimationFrame(tick_);
 };
 run();
})()
