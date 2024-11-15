function addEvent() {
    var universityName = document.getElementById("uni").value;
    var departmentName = document.getElementById("department-name").value;
    var owner = document.getElementById("owner").value;
    var eventName = document.getElementById("eventName").value;
    var eventDescription = document.getElementById("eventDescription").value;
    var eventLocation = document.getElementById("eventLocation").value;
    var eventDate = document.getElementById("eventDate").value;
    var eventLogo = document.getElementById("event-logo").files[0];
    var registrationLink = document.getElementById("registrationLink").value;

    if (eventName.trim() === "" || eventDate === "" || eventLocation.trim() === "" || eventDescription.trim() === "") {
        alert("Please fill out all required fields.");
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        var logoDataURL = e.target.result;

        var newEvent = {
            university: universityName,
            department: departmentName,
            head: owner,
            name: eventName,
            description: eventDescription,
            location: eventLocation,
            date: eventDate,
            logo: logoDataURL,
            link: registrationLink
        };

        var events = JSON.parse(localStorage.getItem("events")) || [];
        events.push(newEvent);
        localStorage.setItem("events", JSON.stringify(events));

        alert("Event added successfully!");
        displayEvents(); 
    };

    if (eventLogo) {
        reader.readAsDataURL(eventLogo);
    } else {
        alert("Please select an event poster.");
    }
}

function displayEvents() {
    var events = JSON.parse(localStorage.getItem("events")) || [];
    var eventList = document.getElementById("eventList");
    eventList.innerHTML = "";

    events.forEach(function(event, index) {
        var listItem = document.createElement("div");
        listItem.style.display = "flex";
        listItem.style.alignItems = "center";
        listItem.style.marginBottom = "20px";
        listItem.style.border = "1px solid #ccc";
        listItem.style.padding = "10px";

        if (event.logo) {
            var logo = document.createElement("img");
            logo.src = event.logo;
            logo.alt = "Event Logo";
            logo.style.width = "100px";
            logo.style.height = "100px";
            logo.style.marginRight = "20px";
            listItem.appendChild(logo);
        }

        var eventDetails = document.createElement("div");
        eventDetails.innerHTML = `
            <strong>University Name:</strong> ${event.university}<br>
            <strong>Department Name:</strong> ${event.department}<br>
            <strong>Head:</strong> ${event.head}<br>
            <strong>Event Name:</strong> ${event.name}<br>
            <strong>Event Description:</strong> ${event.description}<br>
            <strong>Event Time:</strong> ${event.date}<br>
            <strong>Event Location:</strong> ${event.location}<br>
            <strong>Registration Link:</strong> <a href="${event.link}" target="_blank">Register Here</a><br>
        `;

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            deleteEvent(index);
        };

        eventDetails.appendChild(deleteButton);
        listItem.appendChild(eventDetails);
        eventList.appendChild(listItem);
    });
}

function deleteEvent(index) {
    var events = JSON.parse(localStorage.getItem("events")) || [];
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events)); 
    displayEvents(); 
}

displayEvents();
