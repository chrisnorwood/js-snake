/* Objects */

class SnakeGame {
  constructor() {
    this.grid  = this.createGrid(25);
    this.snake = new Snake();
    this.food  = new Food();
  }

  isGameOver() {
    if (this.snake.isInBounds() && this.snake.isNotOverlapping()) {
      return false;
    } else {
      return true;
    }
  }

  parseKey(keyCode) {
    let opposites = {'r': 'l', 'u': 'd', 'l': 'r', 'd': 'u'};
    let keyMap    = {37: 'l', 38: 'u', 39: 'r', 40: 'd'};
    let keyPress  = keyMap[keyCode];

    /* FIx THIS SHIT UP */
    if (keyPress) {
      if ((opposites[keyPress] !== this.snake.direction)) {  
        this.snake.direction = keyPress;
      }
    }
  }

  passTime() {
    this.snake.move(this.food);
  }

  renderSnake() {
    $('.snake').removeClass('snake');

    let pieces = this.snake.pieces;
    for (var i = 0; i < pieces.length; i++) {
      $('*[data-grid="'+pieces[i][0]+','+pieces[i][1]+'"]').addClass('snake');
    }
  }

  renderFood() {
    $('.food').removeClass('food');
    let food = this.food.location;
    $('*[data-grid="'+food[0]+','+food[1]+'"]').addClass('food');
  }

  renderGrid() {
    let $grid = $('.snake-game');
    
    $grid.empty();

    for (var i = 0; i < this.grid.length; i++) {
      let $row = $('<div class="row"></div>')
      
      for (var ii = 0; ii < this.grid[i].length; ii++) {
        let $square = $('<div class="square"></div>');
      
        $square.attr('data-grid', i+','+ii)  
        $row.append($square);
      }

      $grid.append($row);
    }
  }

  createGrid(size) {
    let grid = [];
    for (var i = 0; i < size; i++) {
      grid.push(this.createRow(size));
    }

    return grid;
  }

  createRow(size) {
    let row = [];
    for (var i = 0; i < size; i++) {
      row.push(" ");
    }

    return row;
  }
}

class Snake {
  constructor() {
    this.direction = "r";
    this.pieces    = [[12,12],[12,11],[12,10],[12,9],[12,8]];
  }

  isInBounds() {
    if ((this.pieces[0][0] < 25 && this.pieces[0][0] >= 0) && (this.pieces[0][1] < 25 && this.pieces[0][1] >= 0)) {
      return true;
    } else {
      return false;
    }
  }

  isNotOverlapping() {
    let piece = this.pieces[0];
    for (var i = 1; i < this.pieces.length; i++) {
      if (JSON.stringify(piece) === JSON.stringify(this.pieces[i])) {
        return false;
      }
    }
    return true;
  }

  hasPiece(coordinate) {
    var condition = false;
    for (var i = 0; i < this.pieces.length; i++) {
      if ((this.pieces[i][0] == coordinate[0]) && (this.pieces[i][1] == coordinate[1])) {
        var condition = true;
      }
    }
    return condition;
  }

  // Takes 'food' arg so updatePieces can decide if food has been eaten or not
  move(food) {
    switch (this.direction) {
      case "r":
        this.updatePieces(0,1,food);
        break;
      case "l":
        this.updatePieces(0,-1,food);
        break;
      case "u":
        this.updatePieces(-1,0,food);
        break;
      case "d":
        this.updatePieces(1,0,food);
        break;
    }
  }

  updatePieces(yShift, xShift, food) {
    let coord = [this.pieces[0][0]+yShift, this.pieces[0][1]+xShift];
    this.pieces.unshift(coord);
    if (JSON.stringify(food.location) == JSON.stringify(coord)) {
      food.eat();
    } else {
      this.removeTail();
    }
  }

  removeTail() {
    this.pieces.pop();
  }
}

class Food {
  constructor() {
    this.location = [3,4];
  }

  eat() {
    let coords = this.randomCoords();
    this.location = coords;
  }

  randomCoords() {
    let coords = []
    coords.push(Math.floor(Math.random() * 25));
    coords.push(Math.floor(Math.random() * 25));
    return coords;
  }
}
// Implementation

function gameLoop(game) {
  setTimeout(function() {
    game.passTime();

    if (!game.isGameOver()) {
      // Starts event listener for keydown only after clicking '.new-game'
      // Stop event listener, so only one key press per cycle is registered
      $('body').on('keydown', function(event) {
        game.parseKey(event.keyCode);
        $('body').unbind('keydown');
      });

      game.renderSnake();
      game.renderFood();

      gameLoop(game);
    } else {
      alert("gameover");
    }
  }, 100);
}

$(document).ready(function () {
  let game = new SnakeGame();
  game.renderGrid();

  var $button = $('.new-game');
  $button.click(function(event) {
    $button.blur();
    let game = new SnakeGame();
    gameLoop(game);
  });
});