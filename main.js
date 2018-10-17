$(document).ready(function() {
	$('#submit').click(function(event) {
		const connect4=new Connect4('#connect4', document.getElementById('rows').value, document.getElementById('columns').value, 
									document.getElementById('player1_name').value, document.getElementById('player2_name').value);

		event.preventDefault();
		var btn = document.getElementById('submit');
		if (btn.value=="Submit") 
			btn.innerHTML = "Restart";
	})
  connect4.onPlayerMove = function() {
    $('#player').text(connect4.player);
  }
   
  $('#restart').click(function(event) {
    connect4.restart();
  })

});