class toolkit {
    static newElement(name, attributes, ...children) {
	let ele = document.createElement(name);
	for (let attr of Object.keys(attributes)) {
	    ele.setAttribute(attr, attributes[attr]);
	}
	for (let child of children) {
	    ele.appendChild(child);
	}
	return ele;
    }
}
