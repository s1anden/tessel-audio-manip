var express = require("express");
var morgan = require('morgan');
var busboy = require('connect-busboy');
var fs = require('fs');
var app = express();
var sox = require('sox');
// var SoxEffect = require('sox-audionodes').SoxEffect;
var AudioContext = require('web-audio-api').AudioContext;

// Set the views directory
app.set('views', __dirname + '/views');

// Define the view (templating) engine
app.set('view engine', 'ejs');

app.use(morgan('tiny'));
app.use(busboy());

app.post('/recording', function(req, res) {
	var fstream;
	req.pipe(req.busboy);
	req.busboy.on('file', function(fieldname, file, filename) {
		console.log("Uploading: " + filename);
		fstream = fs.createWriteStream(__dirname + '/files/' + filename);
		file.pipe(fstream);
		console.log("Piping to file");
		fstream.on('close', function() {
			res.redirect('back');
		});
	});
	// manipulateFile(function() {
		res.render('index');
	// });
});

app.get('/', function(req, res) {
	res.render('index');
	res.end();
});

// function manipulateFile(callback) {
// 	fs.writeFile("micdata", Buffer.concat(chunks), function(err) {
//       var inputRaw = {
//           numberOfChannels: 1,
//           bitDepth: 16,
//           sampleRate: 44100
//         }, opts = {filename: __dirname + 'micdata',
//           inputRaw: inputRaw},
//       effect = new SoxEffect(new AudioContext(), 'micdata', 'stretch', 2, 10),
//       allAudio, block, blocks = [];
//       effect.on('error', function(err) {
//         console.log('ERROR', err);
//       });
//       effect.on('ready', function() {
//         effect.on('end', function() {
//           audio.play(Buffer.concat(blocks), function(err) {
//           // When we're done playing, clear recordings
//             blocks = [];
//             relay.toggle(1, function toggleOneResult(err) {
//               chunks = [];
//               if (err) console.log("Err toggling 1", err);
//             });
//             console.log('Hold the config button to record...');
//             // Wait for a button press again
//             tessel.button.once('press', startRecording);
//           });
//         });

//         var audioTick = function() {
//           block = soxEffect._tick();
//           blocks.push(block);
//           req.pipe(block);
//           if (!ended) setTimeout(audioTick, 128/44100);
//         }
//         audioTick();
//       });
//     });
// }
app.use(express.static(__dirname + '/public'));

app.listen(50000);
console.log("Server listening at http://localhost:50000/");