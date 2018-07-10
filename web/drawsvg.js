// drawsvg.js
//
// Module providing useful functions for composing interesting svg element trees.


let make = function(name, attributes) {
    let ele = document.createElement(name);
    for (let attr of Object.keys(attributes)) {
	ele.setAttribute(attr, attributes[attr]);
    }
    return ele;
}

function NewPolygon() {
    return make('polygon');
}

// hexagon
// center is expected to be a Location{x, y}
// The ordering of points is relative to the center. The polygon is drawn
// in a clockwise direction, starting with the top-most point on the hexagon.
// If we were using compass directions, the ordering of points would be:
// n, ne, e, se, s, sw, w, nw
function hexagon(centerX, centerY, radius) {
    let delta1 = radius*Math.Cos(Math.PI/3);
    let delta2 = radius*Math.Sin(Math.PI/3);
    let points  =  [
	// north 
	centerX,
	centerY + radius,
	// north east
	centerX + delta1,
	centerY + delta2,
	// east
	centerX + radius,
	centerY,
	// south east
	centerX + delta1,
	centerY - delta2,
	// south
	centerX,
	centerY - radius,
	// south west
	centerX - delta1,
	centerY - delta2,
	// west
	centerX - radius,
	centerY,
	// north west
	centerX - delta1,
	centerY + delta2,
    ];
    return make("polygon", {
	"points": points
    });
}


