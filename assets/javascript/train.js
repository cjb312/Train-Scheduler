$(function() {

// initializing firebase
  var config = {
    apiKey: "AIzaSyAn5y37yUykZppljTW3mli-aTxR4i0_Gds",
    authDomain: "train-4303b.firebaseapp.com",
    databaseURL: "https://train-4303b.firebaseio.com",
    projectId: "train-4303b",
    storageBucket: "train-4303b.appspot.com",
    messagingSenderId: "178489065156"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// train variables
var trainName;
var trainDest;
var trainFirst;
var trainFreq;
var trainNext;
var trainMinAway;

// add train button
$("#add-train-btn").on("click", function() {
	event.preventDefault();
	trainName = $("#train-name-input").val().trim();
		if (trainName === "") {
			$('#nameModal').modal();
			return false;
		}

	trainDest = $("#destination-input").val().trim();
		if (trainDest === "") {
			$('#destinationModal').modal();
			return false;
		}

	trainFirst = $("#first-input").val().trim();
		if (trainFirst === "") {
			$('#firstModal').modal();
			return false;
		}

	trainFreq = $("#frequency-input").val().trim();
		if (trainFreq === "") {
			$('#frequencyModal').modal();
			return false;
		}
		
	var newTrain = {
		name: trainName,
		destination: trainDest,
		first: trainFirst,
		frequency: trainFreq,
	};

	// uploads train data to the database
	database.ref().push(newTrain);

	// modal for when train is successfully added/ clears text boxes for future input
	$('#successModal').modal();
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-input").val("");
	$("#frequency-input").val("");
	return false;
});

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	var trainName = childSnapshot.val().name;
	var trainDest = childSnapshot.val().destination;
	var trainFirst = childSnapshot.val().first;
	var trainFreq = childSnapshot.val().frequency;

	// using momentjs this will convert the times to desired format
	var firstTimeConverted = moment(trainFirst, "HH:mm MM DD YYYY").subtract(1, "years");

	// time to minutes/minutes to next train
	var diffTime = moment().diff(moment(firstTimeConverted), "m");
	var tRemainder = diffTime % trainFreq;
	var minAway = trainFreq - tRemainder;

	// time away /time until next train
	trainMinAway = moment().add(minAway, "minutes");
	trainNext = moment(trainMinAway).format("HH:mm");

	// train data is entered into table
	$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDest
	 + "</td><td>" + trainFreq + "</td><td>" + trainNext + "</td><td>" + minAway + 
	 "</td></tr>");
});

});