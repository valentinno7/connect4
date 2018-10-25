class Connect4 {
    constructor (selector, rows, columns, player1, player2, whostart) {
        this.ROWS = rows;
        this.COLS = columns;
        if(whostart==1) {
            this.playername= player1;
            this.player='red';
        }
        else if(whostart==2) {
            this.playername= player2;
            this.player='black';
        }
        this.selector = document.querySelector("#connect4");
        this.isGameOver = false;
        this.onPlayerMove = function() {};
        this.createGrid(this.selector, this.playername);
        this.setupEventListeners(this.selector, player1, player2);
		if(this.playername=='Computer'){
			this.computerMove();
			this.changePlayer(player1, player2);
		}
    }
	
    createGrid(selector, player1) {
		const that=this;
        const board = selector;
        this.isGameOver = false;
        for (let row = 0; row < this.ROWS; row++) {
            const const_row=document.createElement("div");
            const_row.classList.add("row");
        for (let col = 0; col < this.COLS; col++) {
              const const_col=document.createElement("div");
              const_col.classList.add("col", "empty");
              const_col.setAttribute('data-col', col);
              const_col.setAttribute('data-row', row);
            const_row.appendChild(const_col);
          }
         board.appendChild(const_row);
        }
    }
	
	computerMove(elem) {
		const that=this;
		function setCol() {
			var col;
			do {
				col=Math.floor(Math.random()*Number(that.COLS));
			} while(that.findLastEmptyCell(col)==null)
			const lastEmptyCell=that.findLastEmptyCell(col);
			that.fillCell(lastEmptyCell);
			if(elem!=null)
			isWinner(lastEmptyCell);
		}
		
		function isWinner(cell) {
			const winner=that.checkForWinner(
						cell.getAttribute('data-row'),
						cell.getAttribute('data-col')
					)
			if(winner) {
				that.gameOver(that.player, elem);
				return;
			}
		}
		
		return setCol(elem);
	}
	
	findLastEmptyCell(col) {
		const that=this;
		
		function findLastEmptyCell(col) {
			var cells=document.querySelectorAll('.col[data-col="' + col + '"]');
            for(let i=cells.length-1; i>=0; i--) {
                const cell=cells[i];
                if(cell.classList.contains("empty")){
                    return cell;
                }
            }
            return null;
		}
		return findLastEmptyCell(col);
	}
	
	fillCell(lastEmptyCell) {
		const that=this;
		function fillCell(lastEmptyCell) {
			lastEmptyCell.classList.remove('empty', 'next-'+that.player);
			lastEmptyCell.classList.add(that.player);
			lastEmptyCell.setAttribute('player', that.player);
		}
		return fillCell(lastEmptyCell);
	}
	
	gameOver(winner, elem) {
		const that=this;
		function gameOver(winner, elem) {
			that.isGameOver=true; 
			alert('Game Over! Player '+that.playername +' has won!');
			elem.classList.remove("empty");
			that.ratings(that.playername);
		}	
		return gameOver(winner, elem);	
	}
	
	changePlayer(player1,player2) {
		const that=this;
		function changePlayer(player1, player2){
			that.playername=(that.playername==player1) ? player2:player1;
			that.player=(that.player=='red') ? 'black':'red';
			document.getElementById("player").innerHTML=that.playername;
		}
		return changePlayer(player1, player2);
	}
   
    setupEventListeners(selector, player1, player2) {
        const board=selector;
        const that=this;
		
        if(board) {
            document.querySelectorAll('#connect4 .col.empty').forEach(function(elem) {
                elem.addEventListener("mouseenter", function enter() {
                    if(that.isGameOver)
                        return;
                    const col= elem.getAttribute('data-col');
                    const lastEmptyCell = that.findLastEmptyCell(col);
                    lastEmptyCell.classList.add('next-'+that.player);
                });
            });
        }
		
        if(board ) {
            document.querySelectorAll('#connect4 .col').forEach(function(elem) {
                elem.addEventListener("mouseleave", function leave() {
                    const col = elem.getAttribute('data-col');
					const lastEmptyCell = that.findLastEmptyCell(col);
                    lastEmptyCell.classList.remove('next-'+that.player);					
                });
            });
        } 
		if(board) {
			document.querySelectorAll('#connect4 .col.empty').forEach(function(elem) {
				elem.addEventListener("click", function click() {
					if(that.isGameOver) return;
					const col = elem.getAttribute('data-col');
					const lastEmptyCell = that.findLastEmptyCell(col);
					that.fillCell(lastEmptyCell);
					document.getElementById("giveup").onclick=function(){
						that.changePlayer(player1, player2);
						that.gameOver(that.player, elem);
						return;
					} 
					const winner=that.checkForWinner(
						lastEmptyCell.getAttribute('data-row'),
						lastEmptyCell.getAttribute('data-col')
					)
					if(winner) {
						that.gameOver(that.player, elem);
						return;
					}
					that.changePlayer(player1, player2);
					if(that.playername=='Computer'){
						that.computerMove(elem);
						that.changePlayer(player1, player2);
					}
					that.onPlayerMove();
					var event=document.createEvent('HTMLEvents');
					event.initEvent('mouseenter', true, false);
					this.dispatchEvent(event);	 		
				});
			});
		} 
    }
	checkForWinner(row, col) {
		const that=this;
		
		function getCell(i,j) {
			return document.querySelector('.col[data-row="' + i + '"]'+'[data-col="'+j+'"]');		
		}
		
		function checkDirection(direction) {
			let total = 0;
			let i = Number(row) + Number(direction.i);
			let j = Number(col) + Number(direction.j);
			let next = getCell(i, j);
			
			while (i >= 0 &&
			i < that.ROWS &&
			j >= 0 &&
			j < that.COLS && 
			next.getAttribute('player') === that.player) {
				total++;
				i += direction.i;
				j += direction.j;
				next = getCell(i, j);
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
	
	ratings(winner) {
		const that=this;
	    
		function ratingsList(winner){
			var temp=0;
			if(!localStorage.getItem(winner)) {
				temp=1;
				localStorage.setItem(winner,temp);
			}
			else {
				temp=Number(localStorage.getItem(winner));
				temp++;
				localStorage.setItem(winner, temp);
			}
		}
		return ratingsList(winner);
	}
}