// effects.js
// Adds animations, giving the appeareance of 3 dimensions, by
// changing attributes of the various svg elements.  Notably, the transform
// attribute can do rotations, skews, and translations, and the actual
// x,y positions of the grid points can also be altered.

let grid          = document.querySelector('#grid');
let gridSkewX     = document.querySelector("#gridSkewX");
let gridTranslate = document.querySelector("#gridTranslate");

let getGridSkewX = ()=>{
    return parseInt(gridSkewX.getAttribute('transform').slice(6, -1), 10);
}
let getTranslate = ()=>{
    let t = gridTranslate.getAttribute('transform').slice(10, -1).split(",");
    return {
	x:parseInt(t[0], 10),
	y:parseInt(t[1], 10)
    };
} 
let setGridSkewX = (val)=>{
    gridSkewX.setAttribute('transform', `skewX(${val})`);
}
let setTranslate = (x,y)=>{
    gridTranslate.setAttribute('transform', `translate(${x},${y})`);
}

let row = (n) => {
    return document.querySelector('#row' + n);
}




setGridSkewX(0);
setTranslate(0,0);
{
    let t = getTranslate();
    document.addEventListener('keydown', (event) => {
	const keyName = event.key;
	switch (keyName) {
	case 'ArrowRight':
	    setGridSkewX(getGridSkewX()+1);
	    t = getTranslate();
	    setTranslate(t.x + 1, t.y + 1);
	    break;
	case 'ArrowLeft':
	    setGridSkewX(getGridSkewX()-1);
	    t = getTranslate();
	    setTranslate(t.x - 1, t.y - 1);
	    break;
	}
    });
}
