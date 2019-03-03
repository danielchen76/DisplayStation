
let temperature_outside = null;
let humidity_outside = null;
let temperature_inside = null;
let humidity_inside = null;

let inside_sid = '158d000182e8ee';
let outside_sid = '158d00022c944c';

let events = require('events');
let miSensorsEvent = new events.EventEmitter();

let dgram = require('dgram');
let server = dgram.createSocket('udp4');

server.on('message', onMessage);
server.bind(9898, () => {
	server.addMembership('224.0.0.50');
})

function onMessage(msg, rinfo) {
	let o = JSON.parse(msg);
	if (o.sid == inside_sid) {
		// Inside
		if (o.data == null) {
			return;
		}

		data = JSON.parse(o.data);
		if (data.temperature != null) {
			if (temperature_inside != data.temperature) {
				temperature_inside = data.temperature;
				miSensorsEvent.emit('inside_temp', temperature_inside);
			}
		}

		if (data.humidity != null) {
			if (humidity_inside != data.humidity) {
				humidity_inside = data.humidity;
				miSensorsEvent.emit('inside_hum', humidity_inside);
			}
		}
	} else if (o.sid == outside_sid) {
		// Outside
		if (o.data == null) {
			return;
		}

		data = JSON.parse(o.data);
		if (data.temperature != null) {
			if (temperature_outside != data.temperature) {
				temperature_outside = data.temperature;
				miSensorsEvent.emit('outside_temp', temperature_outside);
			}
		}

		if (data.humidity != null) {
			if (humidity_outside != data.humidity) {
				humidity_outside = data.humidity;
				miSensorsEvent.emit('outside_hum', humidity_outside);
			}
		}
	}
}

setTimeout( function() {
	let readMsg = '{"cmd":"read", "sid":"' + inside_sid + '"}';
	server.send(readMsg, 9898, '192.168.2.72');

	readMsg = '{"cmd":"read", "sid":"' + outside_sid + '"}';
	server.send(readMsg, 9898, '192.168.2.72');
}, 5000);


exports.miSensorsEvent = miSensorsEvent;
