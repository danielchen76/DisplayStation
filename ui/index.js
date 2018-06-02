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

var interval = null;

var currentTime = new Date("1900-01-01");

function getString(n) {
    if (n < 10) {
        return "0" + String(n);
    } else {
        return String(n);
    }
}

function setTime(t) {
    var timeString = getString(t.getHours()) + ":" + getString(t.getMinutes());
    time.innerHTML = timeString;
}

function updateTime() {
    now = new Date();

    if (now != currentTime) {
        // Print out the time
        setTime(currentTime);
        currentTime = now;
    }
}

interval = setInterval(updateTime, 1000);
