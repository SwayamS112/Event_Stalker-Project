async function displayEvents() {
    try {
        const response = await fetch('/api/events');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const events = await response.json();
        var eventList = document.getElementById("eventList");
        eventList.innerHTML = "";

        events.forEach(function(event) {
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
                <strong>Department Name:</strong> ${event.department}<br>
                <strong>Head:</strong> ${event.head}<br>
                <strong>Event Title:</strong> ${event.name}<br>
                <strong>Event Location:</strong> ${event.location}<br>
                <strong>Event Date/Time:</strong> ${event.date}<br>
                <strong>Event Description:</strong> ${event.description}<br>
                <strong>Registration Link:</strong> <a href="${event.registrationLink}" target="_blank">Register Here</a><br>
            `;
            listItem.appendChild(eventDetails);
            eventList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error displaying events:', error);
    }
}

displayEvents();

// for dark mode 
let but = document.querySelector("#btn");
but.addEventListener("click",()=>{
    
    console.log("button is clicked");
    
    document.body.classList.toggle("dark-mode"); // css used
    
    if (document.body.classList.contains("dark-mode")) {
        btn.textContent = "Change to Light";
    } else {
        btn.textContent = "Change to Dark";
    }
});