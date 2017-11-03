var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
const cv = require('opencv');
var multipart = require('connect-multiparty');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
	res.end("hola");
});

home=path.resolve("."); 
router.post('/',multipart() ,function(req, res) {
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

  		// do some cool stuff with img

  		// save img
  		img.convertGrayscale();
  		img.save(home+ "/public/images/copy" + name);
  		res.redirect("/?image="+name);
  	});
});

module.exports = router;