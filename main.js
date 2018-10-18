$(document).ready(function() {
	$('#submit').click(function(event) {
		const connect4=new Connect4('#connect4', document.getElementById('rows').value, document.getElementById('columns').value, 
									document.getElementById('player1_name').value, document.getElementById('player2_name').value,
									document.getElementById('firstToStart').value);

		
		var btn = document.getElementById('submit');
		if (btn.innerHTML=="Submit") {		
			btn.innerHTML = "Restart";
		}
		else if(btn.innerHTML=="Restart") {
			connect4.restart(document.getElementById('rows').value, document.getElementById('columns').value, 
									document.getElementById('player1_name').value, document.getElementById('player2_name').value,
									document.getElementById('firstToStart').value);
		}
		event.preventDefault();
	})
  connect4.onPlayerMove = function() {
    $('#player').text(connect4.player);
  }
   
  $('#restart').click(function(event) {
    connect4.restart();
  })

});