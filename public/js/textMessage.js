// app.post("/routes/apiRoutes.js", config);

$.post("/routes/apiRoutes.js", config, "json").then(function() {
  config = JSON.parse(config);
  console.log("twilio try succeeded");
});

firebase.initializeApp(config);

const database = firebase.database();
const ref = database.ref("contacts");
const timeRef = database.ref("time");

const reload = () => {
  location.reload();
};

const clearPersonalInput = () => {
  $("#nameInput").val("");
  $("#phoneNumberInput").val("");
  $("#confirmedTime").val("");
};

$(document).ready(function () {
  $("#submitPersonalInfo").on("click", function (event) {
    let name = $("#nameInput")
      .val()
      .trim();
    let number = $("#phoneNumberInput")
      .val()
      .trim();
    let confirmedTime = $("#confirmedTime")
      .val()
      .trim()
      .replace(/[^0-9 am pm]/g, "");
      let correctedNumber = number.replace(/[^0-9]/g, "");
      
      var userInfo = {
        name: name,
        correctedNumber: correctedNumber
      };
      timeRef.set({
      showTime: confirmedTime
    });
    
    ref.push(userInfo);
    clearPersonalInput();
    reload();
  });
  
  var $restaurantList = $("#restaurant-list");

  var handleSelectButtonClick = function () {
    console.log("Select click is being registered");
    var chosenName = $(this).parent().attr("name");
    var chosenAddress = $(this).parent().attr("address");
    console.log(chosenName, chosenAddress);
    database.ref().child("brewery/name").set(chosenName);
    database.ref().child("brewery/location").set(chosenAddress);
    reload();
  };

  $restaurantList.on("click", ".delete", handleSelectButtonClick);
  
  // Remove button
  // Appending info from Firebase to the table
  
  database.ref("contacts").on("child_added", function (childSnapshot) {
    let name = childSnapshot.val().name;
    let dataKey = childSnapshot.key;
    let username = name + dataKey;
    $(`
    <tr>
        <td scope="row">${name}</td>
        <td>
            <button type="button" class="btn btn-secondary removeUser" data-key="${dataKey}">
            Remove</button>
        </td>
    `).appendTo("#contactList");
  });

  $("#contactList").on("click", ".removeUser", function (event) {
    const key = $(this).attr("data-key");
    ref.child(key).remove();
    reload();
  });

  database.ref("brewery").once("value", function (childSnapshot) {
    let breweryChosen = childSnapshot.val().name
    $(`
    <tr>
        <td scope="row">${breweryChosen}</td>
    `).appendTo("#brewerySelected");
});


  timeRef.on("value", function (snapshot) {
    let timeChosen = snapshot.val().showTime;
    $(`
    <td>${timeChosen}</td>
    `).appendTo("#brewerySelected");
  });

  // Send a SMS when button is clicked!

  // Creating the message to be sent

  timeRef.on("value", function (snapshot) {
    let timeChosen = snapshot.val().showTime;

    database.ref("brewery").once("value", function (childSnapshot) {
      let chosenName = childSnapshot.val().name;
      let chosenAddress = childSnapshot.val().location;
      const message =
        "Hey, we're going to " +
        chosenName +
        " which is at: " +
        chosenAddress +
        ". We will be meeting there at: " +
        timeChosen;
    });
  });

  // Send a SMS when button is clicked!
  $("#submitSendSMS").click(function() {
    timeRef.on("value", function (snapshot) {
      let timeChosen = snapshot.val().showTime;

      database.ref("brewery").once("value", function (childSnapshot) {
        let breweryChosen = childSnapshot.val().name;
        let breweryChosenLocation = childSnapshot.val().location;
        const message =
          "Hey, we're going to " +
          breweryChosen +
          " which is at: " +
          breweryChosenLocation +
          ". We will be meeting there at: " +
          timeChosen;
        console.log(message);

        const SID = "ACde7d929d4b9b0f7e32b6f0f553fe9667";
        const Key = "41cdc646ad2521c5e86216b3b17dca1b";
        database.ref("contacts").once("value", function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();
            let name = childSnapshot.val().correctedNumber;

            $.ajax({
              type: "POST",
              url: "https://api.twilio.com/2010-04-01/Accounts/" +
                SID +
                "/Messages.json",
              data: {
                To: "+1" + name,
                From: "+19562671699",
                Body: message
              },
              beforeSend: function (xhr) {
                xhr.setRequestHeader(
                  "Authorization",
                  "Basic " + btoa(SID + ":" + Key)
                );
              },
              success: function (data) {
                console.log(data);
              },
              error: function (data) {
                console.log(data);
              }
            });

            console.log(message);
          });
        });
      });
    });
  });
});
