$(document).ready(function () {

	var image = getParameterByName('image');
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
	if(image!=""){
		document.getElementById('resultado').style.display = 'block';
		document.getElementById('input').style.display = 'none';
		
		$("#img1").attr("href","./images/"+image);
		$("#img2").attr("src","./images/"+image);
		$("#img3").attr("href","./images/copy"+image);
		$("#img4").attr("src","./images/copy"+image);
	} 
});
