/* global document, setInterval, clearInterval */
var startTime = null;
const secondsInMinute = 60;
const secondsInHour = 60 * 60;

// var seconds = document.getElementById("seconds");
// var minutes = document.getElementById("minutes");
// var hours = document.getElementById("hours");
// var action = document.getElementById("action");
// var reset = document.getElementById("reset");

var time = document.getElementById("timerDiv");
var am = document.getElementById("ampmDiv");

var interval = null;

var currentTime = new Date("1900-01-01");

let in_tempinteger = document.getElementById("in_tempinteger");
let in_tempdecimal = document.getElementById("in_tempdecimal");
let in_huminteger = document.getElementById("in_huminteger");
let in_humdecimal = document.getElementById("in_humdecimal");

let sensors = require('electron').remote.require('./sensors/misensors');
sensors.miSensorsEvent.on('inside_temp', update_inside_temp);
sensors.miSensorsEvent.on('inside_hum', update_inside_hum);
sensors.miSensorsEvent.on('outside_temp', update_outside_temp);
sensors.miSensorsEvent.on('outside_hum', update_outside_hum);

const con = require('electron').remote.getGlobal('console')
con.log('This will be output to the main process console.')


function getString(n) {
    if (n < 10) {
        return "0" + String(n);
    } else {
        return String(n);
    }
}

function setTime(t) {
	let hour = t.getHours();

	let pm = false;
	if (hour > 12) {
		pm = true;
		hour -= 12;
	} else if (hour == 0) {
		hour = 12;		// 12am
	} else if (hour == 12) {
		pm = true;		// 12pm
	}

    var timeString = getString(hour) + ":" + getString(t.getMinutes());
	time.innerHTML = timeString;
	am.innerHTML = pm ? "PM" : "AM";
}

function updateTime() {
	now = new Date();

    if (now != currentTime) {
        // Print out the time
        setTime(now);
        currentTime = now;
    }
}

interval = setInterval(updateTime, 1000);

function separateDigital(data) {
	let ret = {integer: 0, decimal: 0};
	ret.integer = ~~(data / 100);
	let decimal = data % 100;
	ret.decimal = ~~(decimal / 10);
	if ((decimal % 10) >= 5) {
		ret.decimal++;
	}

	if (ret.decimal == 10) {
		ret.decimal = 0;
		ret.integer++;
	}

	return ret;
}

function update_inside_temp(data) {
	let ret = separateDigital(data);
	in_tempinteger.innerHTML = ret.integer;
	in_tempdecimal.innerHTML = '.' + ret.decimal + '°C';
}

function update_inside_hum(data) {
	let ret = separateDigital(data);
	in_huminteger.innerHTML = ret.integer;
	in_humdecimal.innerHTML = '.' + ret.decimal + '%';
}

function update_outside_temp(data) {
	let ret = separateDigital(data);
	out_tempinteger.innerHTML = ret.integer;
	out_tempdecimal.innerHTML = '.' + ret.decimal + '°C';
}

function update_outside_hum(data) {
	let ret = separateDigital(data);
	out_huminteger.innerHTML = ret.integer;
	out_humdecimal.innerHTML = '.' + ret.decimal + '%';
}
