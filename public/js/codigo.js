$(document).ready(function () {

    //obtener parametro image de la URI
	var image = getParameterByName('image');
    
    //hacer si el parametro image != "" 
	if(image!=""){
		//mostrar resultados 
		document.getElementById('resultado').style.display = 'block';
		//ocultar formulario
		document.getElementById('input').style.display = 'none';

        //modificar las imagenes
		$("#img1").attr("href","./images/"+image);
		$("#img2").attr("src","./images/"+image);
		$("#img3").attr("href","./images/copy"+image);
		$("#img4").attr("src","./images/copy"+image);
	} 

	$(document).on("click", "#filtro", function () {
        // Obtener la referencia a la lista
		var lista = document.getElementById("filtro");
		// Obtener el índice de la opción que se ha seleccionado
		var indiceSeleccionado = lista.selectedIndex;
		// Con el índice y el array "options", obtener la opción seleccionada
		var opcionSeleccionada = lista.options[indiceSeleccionado];
		// Obtener el valor y el texto de la opción seleccionada
		var textoSeleccionado = opcionSeleccionada.text;
		var valorSeleccionado = opcionSeleccionada.value;
        
		console.log(valorSeleccionado);

		$("#upload-form").attr("action","/upload/"+valorSeleccionado);
    });

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
});
