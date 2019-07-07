const firebaseConfig = {
    apiKey: "AIzaSyBTXRF4Pcr6VIlQ0CLMcs7HLl3kBaiGhGw",
    authDomain: "train-scheduler-6f1b8.firebaseapp.com",
    databaseURL: "https://train-scheduler-6f1b8.firebaseio.com",
    projectId: "train-scheduler-6f1b8",
    storageBucket: "",
    messagingSenderId: "82360838789",
    appId: "1:82360838789:web:455450ec1ae93a00"
  };
firebase.initializeApp(firebaseConfig);

let trainData = firebase.database();

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    let trainName = $("#name-input")
      .val()
      .trim();
    let destination = $("#destination-input")
      .val()
      .trim();
    let firstTime = $("#first-time-input")
      .val()
      .trim();
    let frequency = $("#frequency-input")
      .val()
      .trim();
  
    let newTrain = {
      name: trainName,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency
    };
  
    trainData.ref().push(newTrain);

    console.log(newTrain);
  
    alert("Train Added!!");
  
    $("#name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
  });

  trainData.ref().on("child_added", function(childSnapshot) {
  
    let Name = childSnapshot.val().name;
    let Destination = childSnapshot.val().destination;
    let Frequency = childSnapshot.val().frequency;
    let FirstTime = childSnapshot.val().firstTime;
  
    let time = FirstTime.split(":");
    let trainTime = moment()
      .hours(time[0])
      .minutes(time[1]);
    let maxMoment = moment.max(moment(), trainTime);
    let Minutes;
    let Arrival;
  
    if (maxMoment === trainTime) {
      Arrival = trainTime.format("hh:mm A");
      Minutes = trainTime.diff(moment(), "minutes");
    } else {
      let differenceTimes = moment().diff(trainTime, "minutes");
      let Remainder = differenceTimes % Frequency;
      Minutes = Frequency - Remainder;
      Arrival = moment()
        .add(Minutes, "m")
        .format("hh:mm A");
    }
  
    $("#train-table > tbody").append(
      $("<tr>").append(
        $("<td>").text(Name),
        $("<td>").text(Destination),
        $("<td>").text(Frequency),
        $("<td>").text(Arrival),
        $("<td>").text(Minutes)
      )
    );
  });