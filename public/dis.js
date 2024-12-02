window.addEventListener("storage", (e) => {
    if (e.key === "eventUpdated") {
        console.log("Event list update triggered.");
        displayEvents(); 
    }
});

function displayEvents() {
    fetch("/Display_Events")
      .then(response => response.json())
      .then(events => {
        var eventList = document.getElementById("eventList");
        eventList.innerHTML = ""; 
        
        events.forEach(event => {
          var listItem = document.createElement("div");
          var eventDetails = document.createElement("div");
          eventDetails.innerHTML = `
            <div class="event-image">
              <img src="/uploads/${event.logo}" alt="Event Logo" onerror="this.src='/default-event-image.jpg'">
            </div>
            <div class="event-info">
              <strong>Department Name:</strong> ${event.department}<br>
              <strong>Head:</strong> ${event.head}<br>
              <strong>Event Name:</strong> ${event.name}<br>
              <strong>Event Location:</strong> ${event.location}<br>
              <strong>Event Time:</strong> ${event.date}<br>
              <strong>Event Description:</strong> ${event.description}<br>
              <strong>Registration Link:</strong> <a href="${event.link}" target="_blank">Register Here</a><br>
            </div>
          `;
          listItem.appendChild(eventDetails);
          eventList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error("Error fetching events:", error);
        alert("Failed to load events.");
      });
  }
  

function fetchAndDisplayEvents() {
    fetch("/api/events")
      .then(response => response.json())
      .then(events => {
        const marqueeContainer = document.querySelector(".marquee");
        marqueeContainer.innerHTML = ""; // Clear previous event logos
  
        events.forEach(event => {
          const eventLink = document.createElement("a");
          eventLink.href = event.link;
          eventLink.target = "_blank";
  
          const eventLogo = document.createElement("img");
          eventLogo.src = `/uploads/${event.logo}`;
          eventLogo.alt = event.name;
          eventLogo.onerror = function() {
            this.src = "/default-event-image.jpg";
          };
  
          eventLink.appendChild(eventLogo);
          marqueeContainer.appendChild(eventLink);
        });
      })
      .catch(error => console.error("Error fetching events:", error));
  }   

// Dark mode toggle
let but = document.querySelector("#btn");
but.addEventListener("click", () => {
    console.log("Button is clicked");

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        but.textContent = "Change to Light";
    } else {
        but.textContent = "Change to Dark";
    }
});
