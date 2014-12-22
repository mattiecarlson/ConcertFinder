
  "use strict";
  var concertAmount = 3;
  var zip = 0;
  var distance = 100;
  var valid = true;
  var globalArtist = "";
  var artistArray = [];


  window.onload = function() {
    console.log("onload");
    document.getElementById("zipentered").onclick = processZip;
    document.getElementById("distances").onchange = changeDistance;
  };

  function changeDistance() {
    distance = document.getElementById("distances").value;
  }


  function callback(tabs) {
    var currentTab = tabs[0];
    var tabTitle = tabs[0].title;
    var artist = tabTitle.split("-");
    globalArtist = artist[1].trim();
    artistRequest(globalArtist);
    console.log(globalArtist);
  }
  // Next funtion: Changing distance
    // On change, change distance variable,

  // Next function: Add functionality to buy button

  // Next function: Add functionality to not interested button

  // Next function: Put concerts on page one by one max of concertAmount, currently set to 3.

  // 


  function processZip() {
    console.log("processZip");
    var testZip = document.getElementById("myzip").value;
    console.log(testZip);
    // Checks to see if it is a reasonable zip code entry
    if (!/^\d{5}$/.test(testZip)) {
      document.getElementById("error").style.display = "block";
    } else {
      zip = testZip;
      valid = true;
      var toShow = document.getElementsByClassName("after");
      for(var i = toShow.length - 1; i >= 0; i--) {
        toShow[i].classList.remove("after");
      }
      document.getElementById("zip").style.display = "none";
      document.getElementById("error").style.display = "none";
    }
    if(valid) {
      console.log("get tab");
      var query = { active: true, currentWindow: true };
      chrome.tabs.query(query, callback); //gets artist name
    }
  }

  function concertRequest(artistID, zipcode, radius) {
    var currentdate = new Date();
    var startDate = currentdate.getFullYear() + "-" + currentdate.getMonth() + "-" + 
          currentdate.getDay() + "T" + currentdate.getHours() + ":" + 
          currentdate.getMinutes() + ":" + currentdate.getSeconds();
    var endDate = (currentdate.getFullYear() + 1) + "-" + currentdate.getMonth() + "-" + 
                 currentdate.getDay() + "T" + currentdate.getHours() + ":" + 
                 currentdate.getMinutes() + ":" + currentdate.getSeconds();


    var request = new XMLHttpRequest();
    request.onload = processConcert;
    request.open("GET", "http://api.jambase.com/events?artistid=" + 
                  artistID + "&zipCode=" + zip + "&radius=" + radius + 
                  /*"&startDate=" + startDate + "&endDate=" + endDate + */"&api_key=ag298uy66eapgh94jvffzh8k", true);
   request.send();
  }

  function artistRequest(artist) {
    var request = new XMLHttpRequest();
    request.onload = processArtist;
    request.open("GET", "http://api.jambase.com/artists?name=" + artist + "&api_key=ag298uy66eapgh94jvffzh8k", true);
    request.send();
  }

  function processArtist() {
    var data = JSON.parse(this.responseText);
    console.log("ProcessingArtiste");
    if(data.Artists[0]) {
      console.log("artist[0] != null");
      var artistID = data.Artists[0].Id;
      console.log(artistID + ", " + zip + ", " + distance);
      concertRequest(artistID, zip, distance);
    } else {
      console.log("artist=null");
    }
  }

  function processConcert() {
    var data = JSON.parse(this.responseText);
    console.log(data);
    for(var i = 0; i < data.Events.length; i++) {
      var div = document.createElement("div")
      var pArtist = document.createElement("p");
      var pLocation = document.createElement("p");
      var pdate = document.createElement("p");
      var ticketURL = document.createElement("a");

      pArtist.innerHTML = "Artist: " + globalArtist; //change this later
      pdate.innerHTML = "Date: " + data.Events[i].Date;
      pLocation.innerHTML = "Location: " + data.Events[i].Venue.City + ", " + data.Events[i].Venue.StateCode;
      //ticketURL.innerHTML = "Buy Tickets";
     // var urlString = data.Events[i].TicketURL;

      div.id = "concert" + i;
      div.appendChild(pArtist);
      div.appendChild(pLocation);
      div.appendChild(pdate);
      /*if(urlString !== null) {
        urlString = urlString.substring(4);
        var index = urlString.indexOf("=http");
        urlString = "http" + urlString.substring(0,index);
        div.appendChild(ticketURL);
        ticketURL.href = urlString
      }*/

      div.classList.add("concert");
      document.getElementById("concerts").appendChild(div);
    }
  }
