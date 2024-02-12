import { view } from '/js/modules/view.js';
import { tf } from '/js/modules/tf.js';
import { rosbridge } from '/js/modules/rosbridge.js';
import { settings } from '/js/modules/persistent.js';
import { Status } from '/js/modules/status.js';

let topic = getTopic("{uniqueID}");
let status = new Status(
	document.getElementById("{uniqueID}_icon"),
	document.getElementById("{uniqueID}_status")
);

if(settings.hasOwnProperty("{uniqueID}")){
	const loaded_data  = settings["{uniqueID}"];
	topic = loaded_data.topic;
}else{
	saveSettings();
}

if(topic == ""){
	topic = "/initialpose";
	status.setWarn("No topic found, defaulting to /initialpose");
	saveSettings();
}

function saveSettings(){
	settings["{uniqueID}"] = {
		topic: topic
	}
	settings.save();
}


const canvas = document.getElementById('{uniqueID}_canvas');
const ctx = canvas.getContext('2d');

const view_container = document.getElementById("view_container");
const icon = document.getElementById("{uniqueID}_icon");

let active = false;
let sprite = new Image();
let start_point = undefined;
let delta = undefined;
sprite.src = "assets/initialpose.png";
icon.style.backgroundColor = "rgba(255, 54, 54, 1.0)";

function resizeScreen(){
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
}

function sendServiceRequestmode(val){
    var request = new ROSLIB.ServiceRequest({
		mode: val
	});
	var client = new ROSLIB.Service({
		ros: rosbridge.ros,
		name: '/switch_mode',
		serviceType: 'apex_goat_feature_interfaces/srv/ModeSwitch'
	});
	openModal("{uniqueID}_loading_modal");
	client.callService(request, function(result) {
		console.log("Result from service call " + result.reason);
		closeModal("{uniqueID}_loading_modal");
	});
	
}

window.addEventListener('resize', resizeScreen);
window.addEventListener('orientationchange', resizeScreen);

function setActive(value){
	active = value;
	// view.setInputMovementEnabled(!active);

	if(active){
		// addListeners();
		var val = 1
		sendServiceRequestmode(val);
		icon.style.backgroundColor = "rgba(104, 255, 104, 1.0)";
	}else{
		// removeListeners()
		var val = 0
		sendServiceRequestmode(val);
		icon.style.backgroundColor = "rgba(255, 54, 54, 1.0)";
	}
}

// Topics

// const selectionbox = document.getElementById("{uniqueID}_topic");

// async function loadTopics(){
// 	let result = await rosbridge.get_topics("geometry_msgs/msg/PoseWithCovarianceStamped");

// 	let topiclist = "";
// 	result.forEach(element => {
// 		topiclist += "<option value='"+element+"'>"+element+"</option>"
// 	});
// 	selectionbox.innerHTML = topiclist

// 	if(result.includes(topic)){
// 		selectionbox.value = topic;
// 	}else{
// 		topiclist += "<option value='"+topic+"'>"+topic+"</option>"
// 		selectionbox.innerHTML = topiclist
// 		selectionbox.value = topic;
// 	}
// }

// selectionbox.addEventListener("change", (event) => {
// 	topic = selectionbox.value;
// 	saveSettings();
// 	status.setOK();
// });

// loadTopics();

// Long press modal open stuff

let longPressTimer;
let isLongPress = false;

icon.addEventListener("click", (event) =>{
	if(!isLongPress)
		setActive(!active);
	else
		isLongPress = false;
});

icon.addEventListener("mousedown", startLongPress);
icon.addEventListener("touchstart", startLongPress);

icon.addEventListener("mouseup", cancelLongPress);
icon.addEventListener("mouseleave", cancelLongPress);
icon.addEventListener("touchend", cancelLongPress);
icon.addEventListener("touchcancel", cancelLongPress);

icon.addEventListener("contextmenu", (event) => {
	event.preventDefault();
});

function startLongPress(event) {
	isLongPress = false;
	longPressTimer = setTimeout(() => {
		isLongPress = true;
		// loadTopics();
		openModal("{uniqueID}_modal");
	}, 500);
}

function cancelLongPress(event) {
	clearTimeout(longPressTimer);
}

resizeScreen();

console.log("MappingMode Widget Loaded {uniqueID}")