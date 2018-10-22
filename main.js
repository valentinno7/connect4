$(document).ready(function() {
	$('#submit').click(function(event) {
		console.log(document.getElementById('player1_name').value);
		if (document.getElementById('player1_name').value=="Guest") {
			console.log(document.getElementById('player1_name').value);
			if(!confirm("If you want your results to be stored sign in or sign up!"))
			return;
		} 
		const connect4=new Connect4('#connect4', document.getElementById('rows').value, document.getElementById('columns').value, 
									document.getElementById('player1_name').value, document.getElementById('player2_name').value,
									document.getElementById('firstToStart').value);

		var btn = document.getElementById('submit');
		if (btn.innerHTML=="Submit") {		
			btn.innerHTML = "Restart";
		}
		/*else if(btn.innerHTML=="Restart") {
			connect4.restart(document.getElementById('rows').value, document.getElementById('columns').value, 
									document.getElementById('player1_name').value, document.getElementById('player2_name').value,
									document.getElementById('firstToStart').value);
		} */
		event.preventDefault();
	})
  connect4.onPlayerMove = function() {
    $('#player').text(connect4.player);
  }
   
  $('#restart').click(function(event) {
    connect4.restart();
  })
  
});

	function on() {
		document.getElementById("overlay").style.display = "block";
		
		
	}

	function off() {
		document.getElementById("overlay").style.display = "none";
		
	}
	
	function signIn(){
		var name=document.getElementById('login');
		document.getElementById('player1_name').value=name.value;
		off();
		event.preventDefault();
	}