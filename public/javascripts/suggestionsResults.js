$(function(){
	var letters = $('#letters .letter');
	
	$('.getResult').on('click',function(){
			lettersGiven = "";
			filledOut = true;

			letters.each(function(index,element){
				element = $(element);
				var letter = element.children('p').text();
				if (letter === ""){
					filledOut = false;
				}
				lettersGiven += letter;
				if (element.hasClass("selected-mine")){
					lettersGiven += "m";
				} else if (element.hasClass("selected-theirs")){
					lettersGiven += "t";
				}
				lettersGiven += " ";

			});	
			if (filledOut){
				alert("String to send to backend: " + lettersGiven);
			} else {
				// TODO: Turn this into an error message box
				alert("Please fill out every letter")
			}


		});
})
