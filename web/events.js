// events.js

function newElement(name, attributes, ...children) {
    let dom = document.createElement(name);
    for (let attr of Object.keys(attributes)) {
	dom.setAttribute(attr, attributes[attr]);
    }
    for (let child of children) {
	dom.appendChild(child);
    }
    return document.body.appendChild(dom);
}



function NewPolygon() {
    return newElement('polygon', {});
}

class Background {
    constructor(maxPolygonCount) {
	this.svg = newElement('svg', {class: 'BackgroundSVG'});

	// The polygon map contains all of the usable polygon svg elements
	// in the background. They are created when the background is initialized.
	// Conservation of Polygons:  No polygon is created nor destroyed.
	this.polygonHeap = [];
	this.polygonHeap.length = maxPolygonCount;
	for (let i = 0; i < maxPolygonCount; i++) {
	    this.polygonHeap[i] = this.svg.appendChild(NewPolygon());
	}
	   
	// The polygon free list is an array of numbers, each of these strings
	// is the key for a unused polygon in Background.polygonHeap.  These
	// can be thought of conceptually as "unallocated polygons".
	this.polygonFreeList = [];
    }

    StandardGrid() {
	for (let i = 0; i < this.polygonHeap.length; i++) {
	    polygonHeap[i].setAttribute();
	}
    }
    
}



// todo:
// convert this into a drawing package, the file should be named "draw.js",
// and it should export a variety of useful things that operate on arbitrary
// svg elements, or canvas contexts, etc.  It should be a portable library.
Draw = {
    test(c) {
	c.strokeRect(10, 10, 100, 100);
    }
}

class Map {
    constructor() {
	this.x = 100;
	this.y = 200;
    }
}


// todo: make a module for structures like this.
function struct$Location(x,y) {
    return {
	x: x,
	y: y
    };
}

class Player {
    constructor(watchQ) {
	this.location = struct$Location(0,0);
	this.targetLocation = struct$Location(0,0);
	this.hp = 100;
	this.watcher = watcher;
    }
    TargetLocation(x, y) {
	this.targetLocation.x = x;
	this.targetLocation.y = y;
    }
}

class Game {
    constructor() {
	this.watcher = {};
	this.myPlayer = new Player(watcher);
	this.otherPlayers = {};
    }
    addPlayer(name) {
	this.otherPlayers[name] = new Player(this.watcher);
    }
    removePlayer(name) {
	// delete from player map.
    }
}

// todo:
// should probably be a "watch queue" instead of a watch stack.
class WatchStack {
    constructor() {
	this.hasMessage = false;
	this.messages = [];
    }
    push(message) {
	messages.push(message);
	this.hasMessage = true;
    }
    pop(message) {
	let message = messages.pop();
	if (this.messages.length === 0) {
	    this.hasMessage = false;
	}
 	return message;
    }
}
  
// For debugging purposes, these are going to be kept in global variables.
// As a result, they will be accessible via the console.
var background;
function main(event) {
    const MaxPolygons = 100;
    background = new Background(MaxPolygons);
    
    m = new Map();
    console.log(`Logical Map dimensions: ${m.x}, ${m.y}`);
    console.log("Exiting Main.");
};

window.addEventListener("load", main);
console.log("Javascript loaded.");
