// function setup() {
// 	createCanvas(displayWidth, displayHeight);  
// 	noLoop();
// 	// stroke(100);
// 	strokeWeight(1);

// 	// background(200);


// 		// get points from purge
// 	var pts = purgeMost();

// 	for (var i = 0; i < pts.length; i++) {
// 		var x = (i / pts.length) * displayWidth;
// 		var y = (pts[i] * displayHeight) + (displayHeight / 2);
// 		point(x, y);
// 	}

// }

// function purgeMost() {
// 	points = [];
// 	for (var point in leftChannel) {
// 		if (leftChannel.hasOwnProperty(point)) {
// 			points.push(leftChannel[point])
// 		}
// 	}
// 	console.log("purge complete");

// 	newArr = [];

// 	for (var i = 0; i < points.length; i ++) {
// 		newArr.push(points[i]);
// 	}

// 	return newArr;
// }

// function draw() {

// }