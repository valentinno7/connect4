class Connect4 {
    constructor (selector, rows, columns, player1, player2, whostart, level, pass) {
        this.ROWS = rows;
        this.COLS = columns;
        this.level=level;
        this.playerturn=0;
        this.computerturn=0;
        this.selector = document.querySelector("#connect4");
        this.isGameOver = false;
        this.onPlayerMove = function() {};
		this.pass=pass;
		this.whostart=whostart;
		this.player1=player1;
		this.player2=player2;
		this.player='red';
		if(player2!="Computer"){
			this.playername=player1;
			this.joinGame(player1,pass, parseInt(this.ROWS), parseInt(this.COLS));
		}
		else {
			if(whostart==1) {
				this.playername= player1;
				this.player='red';
        }
			else if(whostart==2) {
				this.playername= player2;
				this.player='black';
			}
			this.createGrid(this.selector, this.playername, this.whostart);
			this.setupEventListeners(this.selector, player1, player2);
		}
		this.leaveGame();
		if(localStorage.length==0) {
			localStorage.setItem(1,columns-1);
			this.computerturn++;
		}
		if(this.playername=='Computer'){
			this.computerMove();
			this.changePlayer(player1, player2);
		}
    }
	
	joinGame(login, pass, rows, columns) {
		const that=this;
		console.log(typeof rows);
		const xhr = new XMLHttpRequest();
		const url = "http://twserver.alunos.dcc.fc.up.pt:8008/join";
		var data = JSON.stringify({"group": 99, "nick": login, "pass": pass, 
								   "size": { "rows":rows, "columns":columns}});
								   
		xhr.open("POST", url, true);
		console.log(data);
		xhr.send(data);
		xhr.onreadystatechange=function() {
			if(xhr.readyState===4 && xhr.status==200){
				console.log(xhr.responseText);
				that.updateGame(login, JSON.parse(xhr.responseText));	
			}
		}
	}
	
	updateGame(login,gameId){
		let count=0;
		const that=this;
		console.log(gameId.game);
		that.gameId=gameId.game;
		const xhr = new XMLHttpRequest();
		var url="http://twserver.alunos.dcc.fc.up.pt:8008/update?"+encodeURI("nick="+login+"&game="+gameId.game);
		console.log(encodeURI(url));
		xhr.open("GET", url, true);
		xhr.send();
		xhr.onreadystatechange=function() {
			if(xhr.readyState>=3 && xhr.status==200){
				count++;
				if(count==1) {
					var temp=xhr.responseText.split('data:{"board":');
					temp=String(temp);
					let index=temp.indexOf('turn":"');
					var temp1=temp.substr(index+7);
					index=temp1.indexOf('"}');
					temp1=temp1.substr(0,index);
					console.log(temp1);
					if(temp1==that.player1){
						console.log('pirmas prisiloginau');
						that.player1=temp1;
						that.player='red';
					}
					else {
						console.log('antras prisiloginau');
						that.player2=temp1;
						that.player='black';
						var waitingCanvas=document.getElementById('waitingCanvas');
						var ctx=waitingCanvas.getContext("2d");
						ctx.font="20px Times New Roman";
						ctx.fillText("Waiting for another player turn",10,50);
						document.getElementById('connect4').style.pointerEvents='none';
						waitingCanvas.style.display="block";
						
					}
					document.getElementById('turn').innerHTML=('It is Player '+temp1 +' turn!');
					console.log(that.player1, that.player2, that.player);
					that.createGrid(that.selector, that.playername, that.whostart);
					that.setupEventListeners(that.selector, that.player1, that.player2);
					
				}
				else if (count>1){
					var waitingCanvas=document.getElementById('waitingCanvas');
					var ctx=waitingCanvas.getContext("2d");
					ctx.font="20px Times New Roman";
					ctx.fillText("Waiting for another player turn",10,50);
					document.getElementById('connect4').style.pointerEvents='auto';
					waitingCanvas.style.display="none";
					console.log("ėjimas: "+count);
					var response=String(xhr.responseText);
					let index=response.lastIndexOf("data:");
					response=response.substr(index+5);
					response=JSON.parse(response);
					console.log(response);
					document.getElementById('turn').innerHTML=('It is Player '+response.turn +' turn!');
					if(response.turn==document.getElementById('player1_name').value){
						that.changePlayer(that.player1, that.player2);
						const lastEmptyCell = that.findLastEmptyCell(response.column);
						console.log(response.column);
						console.log(lastEmptyCell);
						that.fillCell(lastEmptyCell);
						that.changePlayer(that.player1, that.player2);
					}
					else {
						document.getElementById('connect4').style.pointerEvents='none';
						waitingCanvas.style.display="block";
						
					}
					console.log(response.winner);
					if(response.winner!=undefined) {
						if(response.winner!=document.getElementById('player1_name').value) {
							that.changePlayer(that.player1, that.player2);
							const lastEmptyCell = that.findLastEmptyCell(response.column);
							if(lastEmptyCell!=null)
								that.fillCell(lastEmptyCell);
							
						}
						console.log("canvas");
						waitingCanvas.style.display="none";
						that.gameOver(response.winner, that.elem);
						xhr.abort();
						//return;
					}
				}
			}
		}		
	}

	leaveGame() {
		const that=this;
		document.getElementById("giveup").onclick=function(){
					console.log("ate");
					leave();	
				}
		function leave() {
			const xhr = new XMLHttpRequest();
			const url = "http://twserver.alunos.dcc.fc.up.pt:8008/leave";
			var data = JSON.stringify({"nick": document.getElementById('player1_name').value, "pass": that.pass, "game":that.gameId});
			console.log(data);
			xhr.open("POST", url, true);
			console.log(data);
			xhr.send(data);
			xhr.onreadystatechange=function() {
				if(xhr.readyState===4 && xhr.status==200){
					console.log(xhr.responseText);
					document.getElementById('waitingCanvas').style.display="none";
					//that.changePlayer(that.player1, that.player2);
				}
			}
		}
	}
	
	notify(col) {
		console.log(col);
		const that=this;
		const xhr = new XMLHttpRequest();
		const url = "http://twserver.alunos.dcc.fc.up.pt:8008/notify";
		var data = JSON.stringify({"nick": that.player1, "pass": that.pass, "game":that.gameId, "column":col});
		xhr.open("POST", url, true);
		xhr.send(data);
		xhr.onreadystatechange=function() {
			if(xhr.status==400){
				alert('not your turn');
			}
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
	
	computerMove(elem, player1, player2) {
		const that=this;
		function setCol(elem) {
			that.computerturn++;
			console.log(that.computerturn);
			var col;
			if(that.level==2) {
				var col=Number(localStorage.getItem(String(that.computerturn)));
			}
			else {
			do {
				col=Math.floor(Math.random()*Number(that.COLS));
			} while(that.findLastEmptyCell(col)==null)
			}	
			const lastEmptyCell=that.findLastEmptyCell(col);
			that.fillCell(lastEmptyCell);
			if(isWinner(lastEmptyCell, elem))
				return;
			that.changePlayer(player1, player2);
		}
		
		function isWinner(cell, elem) {
			const winner=that.checkForWinner(
						cell.getAttribute('data-row'),
						cell.getAttribute('data-col')
					)
			if(winner) {
				that.gameOver(that.playername, elem);
				return true;
			}
		}
		return setCol(elem, player1, player2);
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
			console.log(that.player);
			lastEmptyCell.setAttribute('player', that.player);
			//that.notify(lastEmptyCell.getAttribute('data-col'));
		}
		return fillCell(lastEmptyCell);
	}
	
	gameOver(winner, elem) {
		const that=this;
		function gameOver(winner, elem) {
			console.log('opapap');
			that.isGameOver=true; 
			elem.classList.remove("empty");
			that.ratings(that.playername);
			document.getElementById('turn').innerHTML='Game Over! Player '+winner +' has won!';
			return;
		}	
		gameOver(winner, elem);	
	}
	
	changePlayer(player1,player2) {
		const that=this;
		function changePlayer(player1, player2){
			that.playername=(that.player=='red') ? player2:player1;
			that.player=(that.player=='red') ? 'black':'red';
			console.log(that.playername);
			//document.getElementById('turn').innerHTML=('It is Player '+that.playername +' turn!');
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
					console.log(elem);
					that.elem=elem;
					that.playerturn++;
					const col = elem.getAttribute('data-col');
					if(localStorage.getItem(String(that.playerturn))&& Number(localStorage.key(String(that.playerturn)))>col)
						localStorage.removeItem(String(that.playerturn));
					localStorage.setItem(that.playerturn, col);
					console.log(col);
					const lastEmptyCell = that.findLastEmptyCell(col);
					console.log(lastEmptyCell);
					if(that.player1!='Computer' && that.player2!='Computer')
						that.notify(lastEmptyCell.getAttribute('data-col'));
					that.fillCell(lastEmptyCell);
					document.getElementById("giveup").onclick=function(){
						that.changePlayer(player1, player2);
						console.log(that.gameId);
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
					console.log(that.player1, that.player2);
					if(that.player1=='Computer' || that.player2=='Computer')
						that.changePlayer(player1, player2);
					console.log(that.playername);
					if(that.playername=='Computer'){
						that.computerMove(elem, player1, player2);
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
			if(!sessionStorage.getItem(winner)) {
				temp=1;
				sessionStorage.setItem(winner,temp);
			}
			else {
				temp=Number(sessionStorage.getItem(winner));
				temp++;
				sessionStorage.setItem(winner, temp);
			}
		}
		return ratingsList(winner);
	}
}