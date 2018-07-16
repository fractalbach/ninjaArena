// websockets.js handles the connection between the web browser and the server.

let SumTestRTT = 0;
let CountTestRTT = 0;
let AverageTestRTT = 0;

let ConsoleMessage1 = `
Sum: ${SumTestRTT}
Count: ${CountTestRTT}
AverageRTT: ${AverageTestRTT}
`;


class WebSocketHub {  
    constructor() {
	this.conn = new WebSocket("wss://thebachend.com/ws/echo");
	this.conn.onclose = WebSocketHub.DefaultHandleClose;
	//this.conn.onmessage = this.HandlePingMessages;
	this.conn.onmessage = WebSocketHub.DefaultHandleMessage;
    }

    static DefaultHandleClose(evt) {
	console.log("Connection closed.");
    }

    static DefaultHandleMessage(evt) {
	let messages = evt.data.split('\n');
        for (let i = 0; i < messages.length; i++) {
	    console.log(messages[i]);
        }
    }

    // DoTestSequenceRTT sends messages to the echo server, waits for the echo,
    // and then calculates an average RTT using the data.
    async DoTestSequenceRTT() {
	this.conn.onmessage = this.HandlePingMessages;
	await sleep(1000);
	let msg;
	for (let i=0; i<100; i++) {
	    msg = JSON.stringify({
		num: i,
		time: (new Date()).getTime()
	    });
	    this.conn.send(msg);
    	    await sleep(10);
	}
	await sleep(500);
	AverageTestRTT = SumTestRTT / CountTestRTT;
	console.log(
	    "Sum:", SumTestRTT, '\n',
	    "Count", CountTestRTT, '\n',
	    "AverageRTT:", AverageTestRTT
	);
	updateAverageRTTValueText(AverageTestRTT);
	this.conn.onmessage = this.HandlePingMessages;
    }
    
    // This version of handle ping message only works for the basic echo server.
    HandlePingMessages(evt) {
	let messages = evt.data.split('\n');
        for (let i = 0; i < messages.length; i++) {
	    
	    let now = (new Date()).getTime();
	    let msg = JSON.parse(messages[i]);
	    let sampleRTT = now - msg.TIME;
	    
	    SumTestRTT += sampleRTT;
	    CountTestRTT++;
	    
	    console.log("Ping#", msg.NUM, "RTT:", sampleRTT, "ms");
	    addGraphValue(msg.NUM, sampleRTT);
        }
    }

    // The value, alpha = 1/8, is reccomended by RFC 6298 for calculating
    // the exponential weighted moving avergage (EWMA) of Round Trip Time.
    // 
    //     EstimatedRTT = (1 - alpha)*EstimatedRTT + alpha*SampleRTT
    // 
    UpdateEstimatedRTT(SampleRTT) {
	this.EstimatedRTT = 0.875*this.EstimatedRTT + 0.125*SampleRTT;
    }
}

// Before Creating the WebSocketHub, test to make sure the browser supports it.
if (window["WebSocket"]) {
    const ws = new WebSocketHub();
    ws.DoTestSequenceRTT();
} else {
    console.log("Cannot connect to Websocket");
}

// taken from...
// stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}


let make = function(name, attributes) {
    let ele = document.createElement(name);
    for (let attr of Object.keys(attributes)) {
	ele.setAttribute(attr, attributes[attr]);
    }
    return ele;
}

// the svg dimensions are h=200, w=400, so for this example, lets map our units:
// 400 px / 20 data = 20 px for each datapoint (x axis)
// 200 px / 200 ms = 1 px for each ms (y axis)
function addGraphValue(x, val) {
    let bar = document.querySelector("#graph").children[x];
    bar.setAttribute('x', 5 * x);
    bar.setAttribute('width', 5);
    bar.setAttribute('height', val);
}

function updateAverageRTTValueText(value) {
    document.querySelector("#graphAverage").textContent =
	"AverageRTT=" + value + "ms";
}

