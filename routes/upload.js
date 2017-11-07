var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
const cv = require('opencv');
var multipart = require('connect-multiparty');
var router = express.Router();
var math = require('mathjs');

home=path.resolve("."); 
/* GET home page. */
router.get('/', function(req, res) {
	ruta = home + "/public/images/" + "citricos.jpg";
	cv.readImage(ruta, function (err, img) {
		if (err) {
			throw err;
		}
		const width = img.width();
		const height = img.height();

		mat=new cv.Matrix(height,width);

		if (width < 1 || height < 1) {
			throw new Error('Image has no size');
		}
		var r=d2h(0);
		var g=d2h(255);
		var b=d2h(0);

		var rgb="0x"+r+g+b;

		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++){
				
				mat.set(i,j, rgb );
			}
		}
		console.log(rgb);
		mat.save(home+ "/public/images/copy.jpg");
		res.end("hola");
	});


});
router.post('/:filtro',multipart() ,function(req, res) {
	console.log(req.params.filtro);
	var file = req.files.image,
	name = file.name,
	type = file.type,
	ruta = home + "/public/images/" + name;

	fs.rename(file.path, ruta, function(err){
		if(err) res.send("Ocurrio un error al intentar subir la imagen");
	});

	cv.readImage(ruta, function (err, img) {
		if (err) {
			throw err;
		}
		const width = img.width();
		const height = img.height();

		if (width < 1 || height < 1) {
			throw new Error('Image has no size');
		}
        //mat=new cv.Matrix(height,width);
        if(img.pixel(0,0)[0] != undefined ){
        	console.log("imagen en color");
        	switch(req.params.filtro){
        		case '1':
        		var mat=negativoColor(img,height,width);
        		break;
        		case '2':
        		var mat=logaritmoColor(img,height,width);
        		break;
        		case '3':
        		var mat=gammaColor(img,height,width);
        		break;
        		case '4':
        		var mat=filtroMaxColor(img,height,width,3,3);
        		break;
        		default:	
        		res.send("Escoger un fltro");
        	}
        }else{
        	switch(req.params.filtro){
        		case '1':
        		var mat=negativo(img,height,width);
        		break;
        		case '2':
        		var mat=logaritmo(img,height,width);
        		break;
        		case '3':
        		var mat=gamma(img,height,width);
        		break;
        		case '4':
        		console.log("filtro max");
        		break;
        		default:	
        		res.send("Escoger un fltro");

        	}
        	mat.convertGrayscale();
        	console.log("imagen b/n");
        } 

        mat.save(home+ "/public/images/copy" + name);
  		//res.end("exitoso");
  		res.redirect("/?image="+name);
  	});
});

function obtener_vector(img,height,width){
	var vector=new Array(height*width);
	var k=0; 
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			vector.push(img.pixel(i,j));
		}
	}
	return vector;
}
//rgb=0 == r rgb=1 == g  rgb=2 == b 
function obtener_rgb(img,height,width,rgb){
	var vector=new Array(height*width);
	var k=0; 
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			vector.push(img.pixel(i,j)[rgb]);
		}
	}
	return vector;
}

function negativoColor(img,height,width){
	var vector_r=obtener_rgb(img,height,width,0);
	var max_r=math.max(vector_r);
	var min_r=math.min(vector_r);
	var vector_g=obtener_rgb(img,height,width,1);
	var max_g=math.max(vector_g);
	var min_g=math.min(vector_g);
	var vector_b=obtener_rgb(img,height,width,2);
	var max_b=math.max(vector_b);
	var min_b=math.min(vector_b);
	
	var neg=new cv.Matrix(height,width);


	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++){
			var valor_r=max_r-img.pixel(i,j)[0]+min_r;
			var valor_g=max_g-img.pixel(i,j)[1]+min_g;
			var valor_b=max_b-img.pixel(i,j)[2]+min_b;
			if(valor_r>255)
				valor_r=255;
			if(valor_g>255)
				valor_g=255;
			if(valor_b>255)
				valor_b=255;
			var r=d2h(valor_r);
			var g=d2h(valor_g);
			var b=d2h(valor_b);
			neg.set(i,j,"0x"+r+g+b);
		}
	}
	return neg;
}

function negativo(img,height,width){
	var vector=obtener_vector(img,height,width);
	var max=math.max(vector);
	var min=math.min(vector);
	var neg = new cv.Matrix(height,width);

	console.log(max,min); 
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++){
			var valor=max-img.pixel(i,j)+min;
			neg.set(i,j,valor);
		}
	}
	return neg;
	
}
function logaritmoColor(img,height,width){
	console.log("Logaritmo color");
	var log=new cv.Matrix(height,width);

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++){
			var valor_r=10 * parseInt( math.log( img.pixel(i,j)[0]+1,10) );
			var valor_g=10 * parseInt( math.log( img.pixel(i,j)[1]+1,10) );
			var valor_b=10 * parseInt( math.log( img.pixel(i,j)[2]+1,10) );
			if(valor_r>255)
				valor_r=255;
			if(valor_g>255)
				valor_g=255;
			if(valor_b>255)
				valor_b=255;
			var r=d2h(valor_r);
			var g=d2h(valor_g);
			var b=d2h(valor_b);
			log.set(i,j,"0x"+r+g+b);
		}
	}
	return log;
}

function logaritmo(img,height,width){
	var neg = new cv.Matrix(height,width);

	console.log(max,min); 
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++){
			var valor=30 * parseInt( math.log( img.pixel(i,j)+1,10) ); 
			neg.set(i,j,valor);
		}
	}
	return neg;
	
}

function gammaColor(img,height,width){
	console.log("GammaColor");
	var gamma=new cv.Matrix(height,width);

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++){
			var valor_r=parseInt( Math.pow(img.pixel(i,j)[0], 1.15) );
			var valor_g=parseInt( Math.pow(img.pixel(i,j)[1], 1.15) );
			var valor_b=parseInt( Math.pow(img.pixel(i,j)[2], 1.15) );
			if(valor_r>255)
				valor_r=255;
			if(valor_g>255)
				valor_g=255;
			if(valor_b>255)
				valor_b=255;
			var r=d2h(valor_r);
			var g=d2h(valor_g);
			var b=d2h(valor_b);
			gamma.set(i,j,"0x"+r+g+b);
		}
	}
	return gamma;
}

function gamma(img,height,width){
	var neg = new cv.Matrix(height,width);

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++){
			var valor=parseInt( Math.pow(img.pixel(i,j), 1.15) ); 
			neg.set(i,j,valor);
		}
	}
	return neg;
	
}

function filtroMaxColor(img,height,width,f,c){
	console.log("GammaColor");

	var filtro=new cv.Matrix(M+2*(f-1),N+2*(c-1));
	var a = (f-1)/2;
	var b = (c-1)/2;
	%dimensiones del filtro

	var imgA=new cv.Matrix(M+2*(f-1),N+2*(c-1));
    imgA=insertar() 


	im1(f:M+f-1,c:N+c-1) = im;
	for i=f:M+f-1
		for j=c:N+c-1
			k(i,j) = min(min(im1(i-a:i+a,j-b:j+b)));
		end
		end
		return log;
}
function d2h(d) { 
	var h= (+d).toString(16)+"";
	if(h.length==1){
		h="0"+h;    	
	}
	return h;
}

module.exports = router;