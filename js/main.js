// these will be toggle functionality
var fRecording = false;
var jRecording = false;
var fired = false;

// recorder global vars
var audio_context;
var recorder;

// jquery doc ready
$( document ).ready(function() {

	// boot recorder
	bootRecorder();

	// bind hotkeys
    $(document).keydown(function(e) {
    	if (!fired) {
    		fired = true;
		    switch(e.which) {

		        case 70: // f
		        startRecording('f');
		        fRecording = true;
		        break;

		        case 74: // j
		        startRecording('j');
		        jRecording = true;
		        break;

		        default: return; // exit this handler for other keys
		    }
		}
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	});

	$(document).keyup(function(e) {
	    switch(e.which) {

	        case 70: // f
	        if (fRecording === true) { // make sure it isn't already off because of the timeout
		        stopRecording('f');
	    	}
	        break;

	        case 74: // j
	        if (jRecording === true) { // make sure it isn't already off because of the timeout
				stopRecording('j');
	        }
	        break;

	        default: return; // exit this handler for other keys
	    }
	    fired = false;
	    e.preventDefault(); // prevent the default action (scroll / move caret)
	});


});






function bootRecorder() {
	try {
		// webkit shim
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		window.URL = window.URL || window.webkitURL;

		audio_context = new AudioContext;
		console.log('Audio context set up.');
		console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
	} catch (e) {
		alert('No web audio support in this browser!');
	}

	navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
		console.log('No live audio input: ' + e);
	});
};



function startUserMedia(stream) {
	var input = audio_context.createMediaStreamSource(stream);
	console.log('Media stream created.');

// Uncomment if you want the audio to feedback directly
//input.connect(audio_context.destination);
//console.log('Input connected to audio context destination.');

recorder = new Recorder(input);
console.log('Recorder initialised.');
}

function startRecording(fOrJ) { // button / this used to be passed in... (on a <button onClick>)
	setTimeout(function() {
    	if ((fOrJ === 'j') && jRecording) stopRecording('j');
    	if ((fOrJ === 'f') && fRecording) stopRecording('f');
		}, 3000);
	recorder && recorder.record();
	// button.disabled = true;
	// button.nextElementSibling.disabled = false;
	console.log('Recording ' + fOrJ);
}

function stopRecording(fOrJ) { // button / this used to be passed in... (on a <button onClick>)
	recorder && recorder.stop();
	fRecording = false;
	jRecording = false;
	// button.disabled = true;
	// button.previousElementSibling.disabled = false;
	console.log('Stopped recording.');

	// create WAV download link using audio data blob
	// createDownloadLink();
	recorder.getBuffer(function(buffer) {
		if (fOrJ === 'f') fBox.updateSamples(buffer); // why doesnt j work???
		if (fOrJ === 'j') jBox.updateSamples(buffer);
	});

	recorder.clear();
}

function getBufferCallback( buffers ) {
    var newSource = audioContext.createBufferSource();
    var newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
    newBuffer.getChannelData(0).set(buffers[0]);
    newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;

    newSource.connect( audioContext.destination );
    newSource.start(0);
}

function createDownloadLink() {
	recorder && recorder.exportWAV(function(blob) {
		var url = URL.createObjectURL(blob);
		var li = document.createElement('li');
		var au = document.createElement('audio');
		var hf = document.createElement('a');

		au.controls = true;
		au.src = url;
		hf.href = url;
		hf.download = new Date().toISOString() + '.wav';
		hf.innerHTML = hf.download;
		li.appendChild(au);
		li.appendChild(hf);
		recordingslist.appendChild(li); // look at original to find more about this
	});
}

function Box(centX, color) {
	this.centerX = centX; // should be displayWidth * 1/4 and * 3/4
	this.centerY = displayHeight / 4;
	this.width = displayWidth / 2;
	this.height = displayHeight / 2;
	this.updateP5js = false;
	this.heightBooster = 100;
	this.currentArray = [];
	this.pitchArray = [];
	this.color = color;

	this.erase = function() {
		fill(255);
		this.drawBorder();
	}

	// take in giant array and make image.... . figure out in the morning
	this.updateSamples = function(bigAssArray) {
		this.currentArray = bigAssArray[0];
		this.updateP5js = true; // activate update in p5js draw() loop
	};

	this.drawSamples = function() {
		console.log(this.currentArray);
		this.erase();
		for (let i = 0; i < this.currentArray.length; i++) {
			point(
					(((i * this.width) / this.currentArray.length) + (this.centerX - (this.width / 2))), // x
				    (this.currentArray[i] * this.heightBooster) + this.centerY // y
				 );
		}
	};

	this.updateAndDrawSamplesFilledIn = function() {
		// vertex, begin shape, separate position and negative
		this.positiveArr = [];
		this.negativeArr = [];
		this.erase();
		strokeWeight(1);
		for (let i = 0; i < this.currentArray.length; i+=80) {
			var currentVal = this.currentArray[i];
			if (currentVal >= 0) {
				this.positiveArr.push(currentVal);
			} else {
				this.negativeArr.push(currentVal);
			}
		}

		// draw
		fill(this.color);
		beginShape();
		for (let i = 0; i < this.positiveArr.length; i++) {
			vertex(
					(((i * this.width) / this.positiveArr.length) + (this.centerX - (this.width / 2))), // x
				    (this.positiveArr[i] * this.heightBooster) + this.centerY // y
				);
		}
		for (let i = this.negativeArr.length - 1; i >= 0; i--) { // go backwards
			vertex(
					(((i * this.width) / this.negativeArr.length) + (this.centerX - (this.width / 2))), // x
				    (this.negativeArr[i] * this.heightBooster) + this.centerY // y
				);
		}

		endShape(CLOSE);

		this.updateP5js = true;
	};


	this.makePitchArray = function() {
		var temp = [];
		var bufferSize = 1000; // how many samples at a time to guess the pitch... oo what about going 0-1000, then 1-1001
		this.pitchArray = [];

		// relatively low detail but fast...
		// for (let i = 0; i < this.currentArray.length; i++) {
		// 	temp.push(this.currentArray[i]);
		// 	if (i % bufferSize === 0) { 
		// 		// execute
		// 		this.pitchArray.push(autoCorrelate(temp, 44100));
		// 		// reset
		// 		temp = [];
		// 	}
		// }

		// this gets a LOT more detail
		for (let i = bufferSize; i < this.currentArray.length; i++) {
			while (temp.length !== bufferSize) {
				temp.push(this.currentArray[i]);
				continue;
			}
			this.pitchArray.push(autoCorrelate(temp, 44100));
			temp.shift();
		}
	}

	this.drawPitchArray = function() {
		strokeWeight(7);
		stroke(127);
		for (let i = 0; i < this.pitchArray.length; i++) {
			if (this.pitchArray[i] !== -1) {
				point(
						(((i * this.width) / this.pitchArray.length) + (this.centerX - (this.width / 2))), // x
					    this.height - (((this.pitchArray[i]) * this.height) / 2000) // y
				);
			}
		}
	}

	this.drawSmoothGestures = function() { 


		// consider normalizing that audio if the algorithm rejects values under a certain volume level

		var makeArrayOfGestures = function(pitchArray) {

			var arrayOfGestures = [];
			var temp = [];

			// go through pitchArray and make individual gestures
			var len = pitchArray.length;

			for (let x = 0; x < len; x++) {
				var y = pitchArray[x];
				if ((y !== -1) && (x !== len - 1)) { // if a good value (and not at very end -- cuts last value)
					temp.push([x, y]); 				 // push it as unedited coordinate
				} else { 							 // it's a stupid -1 value
					if (temp.length > 1) { 			 // it's not empty or has 1 meaningless value in it
						arrayOfGestures.push(temp);  // push what we have...
					}
					temp = []; 						 // reset it
				}
			}
			return arrayOfGestures;
		}

		var makeArrayOfSmoothGestures = function(arrayOfGestures) {
			// get a smoother value set for each one....
			var arrayOfSmoothGestures = [];
			for (let i = 0; i < arrayOfGestures.length; i++) {
				var gesture = arrayOfGestures[i]; // this was 'data' in a previous example
				var regress = regression('polynomial', gesture, 4); 
				arrayOfSmoothGestures.push(regress.points);
			}
			return arrayOfSmoothGestures;

		}


		var drawSmoothGesture = function(gesture, originalLength, width, height, centerX) {
			strokeWeight(7);
			stroke(0);
			noFill();
			beginShape();
			// debugger;
			for (let j = 0; j < gesture.length; j++) { // iterate through each coordinate in each gesture
				var x = (((gesture[j][0] * width) / originalLength) + (centerX - (width / 2)));
				var y = height - ((gesture[j][1] * height) / 2000);
				curveVertex(x, y);
			}
			endShape();
		}

		// draw smooth gestures
		var originalLength = this.pitchArray.length; // retain original min/max to place it visually in the correct location
		var arrayOfSmoothGestures = makeArrayOfSmoothGestures(makeArrayOfGestures(this.pitchArray));
		for (let i = 0; i < arrayOfSmoothGestures.length; i++) {
			drawSmoothGesture(arrayOfSmoothGestures[i], originalLength, this.width, this.height, this.centerX);
		}

	}

	this.drawBorder = function() {
		strokeWeight(1);
		rect(this.centerX - (this.width / 2), 0, this.width, this.height);
	};
}


var fBox;
var jBox;
// Box.prototype.updateImage = function() {
// };


function setup() {
	createCanvas(displayWidth, displayHeight);
	fBox = new Box(displayWidth * .25, 'red');
	jBox = new Box(displayWidth * .75, 'blue');
	fBox.drawBorder();
	jBox.drawBorder();
	frameRate(5); // doesn't need to be that fast...

}

function draw() {
	if (fBox.updateP5js) {
		fBox.updateAndDrawSamplesFilledIn();

		fBox.makePitchArray();
		fBox.drawSmoothGestures();
		// fBox.drawPitchArray();

		fBox.updateP5js = false;
	}

	if (jBox.updateP5js) {
		jBox.updateAndDrawSamplesFilledIn();

		jBox.makePitchArray();
		jBox.drawSmoothGestures();
		// jBox.drawPitchArray();

		jBox.updateP5js = false;
	}

}















