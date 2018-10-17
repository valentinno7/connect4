class Connect4 {
  constructor(selector, rows, columns, player1, player2, whostart) {
    this.ROWS = rows;
    this.COLS = columns;
    this.playername= player1;
	//this.playername2=player2;
	this.player='red';
	//console.log('test', this.player, this.player2);
	//console.log(typeof player1);
    this.selector = selector;
    this.isGameOver = false;
    this.onPlayerMove = function() {};
    this.createGrid(this.playername);
    this.setupEventListeners(player1, player2);
  }

  createGrid(player1) {
    const $board = $(this.selector);
    $board.empty();
	//this.player=player1;
    this.isGameOver = false;
	//console.log('test', this.player);
    for (let row = 0; row < this.ROWS; row++) {
      const $row = $('<div>')
        .addClass('row');
      for (let col = 0; col < this.COLS; col++) {
        const $col = $('<div>')
          .addClass('col empty')
          .attr('data-col', col)
          .attr('data-row', row);
        $row.append($col);
      }
      $board.append($row);
    }
  }

  setupEventListeners(player1, player2) {
    const $board = $(this.selector);
    const that = this;
	console.log('test', that.player);
    function findLastEmptyCell(col) {
      const cells = $(`.col[data-col='${col}']`);
      for (let i = cells.length - 1; i >= 0; i--) {
        const $cell = $(cells[i]);
        if ($cell.hasClass('empty')) {
          return $cell;
        }
      }
      return null;
    }

    $board.on('mouseenter', '.col.empty', function() {
      if (that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.addClass(`next-${that.player}`);
    });

    $board.on('mouseleave', '.col', function() {
      $('.col').removeClass(`next-${that.player}`);
    });

    $board.on('click', '.col.empty', function() {
      if (that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.removeClass(`empty next-${that.player}`);
      $lastEmptyCell.addClass(that.player);
      $lastEmptyCell.data('player', that.player);

      const winner = that.checkForWinner(
        $lastEmptyCell.data('row'), 
        $lastEmptyCell.data('col')
      )
      if (winner) {
        that.isGameOver = true;
        alert(`Game Over! Player ${that.playername} has won!`);
        $('.col.empty').removeClass('empty');
        return;
      }
	  console.log('test', that.player, that.player2);
      //that.player = (that.player === String(that.player)) ? String(that.player2) : String(that.player);
	  if(String(that.playername)===player1) {
		 that.player='black';
		 that.playername=player2;
		 console.log('test1',player1, player2, that.player);
		 console.log(typeof that.player, 'tipas');
	  }
	 else { 
		 
		 that.player='red';
		 that.playername=player1;
		 console.log('test2', player1, that.player);
	 }
      that.onPlayerMove();
      $(this).trigger('mouseenter');
    });
  }

  checkForWinner(row, col) {
    const that = this;

    function $getCell(i, j) {
      return $(`.col[data-row='${i}'][data-col='${j}']`);
    }

    function checkDirection(direction) {
      let total = 0;
      let i = row + direction.i;
      let j = col + direction.j;
      let $next = $getCell(i, j);
      while (i >= 0 &&
        i < that.ROWS &&
        j >= 0 &&
        j < that.COLS && 
        $next.data('player') === that.player
      ) {
        total++;
        i += direction.i;
        j += direction.j;
        $next = $getCell(i, j);
      }
      return total;
    }

    function checkWin(directionA, directionB) {
      const total = 1 +
        checkDirection(directionA) +
        checkDirection(directionB);
      if (total >= 4) {
        return that.player;
      } else {
        return null;
      }
    }

    function checkDiagonalBLtoTR() {
      return checkWin({i: 1, j: -1}, {i: 1, j: 1});
    }

    function checkDiagonalTLtoBR() {
      return checkWin({i: 1, j: 1}, {i: -1, j: -1});
    }

    function checkVerticals() {
      return checkWin({i: -1, j: 0}, {i: 1, j: 0});
    }

    function checkHorizontals() {
      return checkWin({i: 0, j: -1}, {i: 0, j: 1});
    }

    return checkVerticals() || 
      checkHorizontals() || 
      checkDiagonalBLtoTR() ||
      checkDiagonalTLtoBR();
  }

  restart () {
    this.createGrid();
    this.onPlayerMove();
  }
}