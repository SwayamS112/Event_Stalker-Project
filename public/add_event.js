function clearForm() {
  document.getElementById("eventForm").reset();
}

// In add_event.js
window.addEventListener('DOMContentLoaded', function() {
  const addEventButton = document.getElementById('addEventButton');
  if (addEventButton) {
    addEventButton.addEventListener('click', addEvent);
  }
});

function addEvent() {
  const formData = new FormData();

  // Append form data values
  formData.append("name", document.getElementById("eventTitle").value);
  formData.append("department", document.getElementById("department").value);
  formData.append("head", document.getElementById("head").value);
  formData.append("location", document.getElementById("location").value);
  formData.append("date", document.getElementById("date").value);
  formData.append("description", document.getElementById("description").value);
  formData.append("link", document.getElementById("registrationLink").value);

  // Append the file input
  const fileInput = document.getElementById("logo");
  if (fileInput.files.length > 0) {
    formData.append("logo", fileInput.files[0]);
  }

 // Send the form data to the server
 fetch("/Add_Events", {
  method: "POST",
  body: formData,
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Failed to add the event.");
    }
    return response.text();
  })
  .then(message => {
    alert(message); // Show success message
    clearForm(); // Clear the form after successful submission
  })
  .catch(error => {
    console.log("Error adding event:", error); // log the error
    alert("Error adding event: " + error.message); // Display error message
  });
}

function fetchAndDisplayEvents() {
  fetch("/Display_Events")
    .then(response => response.json())
    .then(events => {
      const eventList = document.getElementById("eventList");
      eventList.innerHTML = "";
      events.forEach(event => {
        const eventDiv = document.createElement("div");
        eventDiv.innerHTML = `
          <div>
            <img src="/uploads/${event.logo}" alt="${event.name}" onerror="this.src='default-event-image.jpg'">
          </div>
          <p>Department: ${event.department}</p>
          <p>Head: ${event.head}</p>
          <p>Event Title: ${event.name}</p>
          <p>Location: ${event.location}</p>
          <p>Date: ${event.date}</p>
           <p>Discription: ${event.description}</p>
          <p>Registration Link: <a href="${event.link}" target="_blank">Register Here</a></p>
          <button onclick="deleteEvent('${event._id}')">Delete</button>
        `;
        eventList.appendChild(eventDiv);
      });
    })
    .catch(error => console.error("Error fetching events:", error));
}

function deleteEvent(eventId) {
  fetch(`/Delete_Event/${eventId}`, { method: "DELETE" })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          fetchAndDisplayEvents();
      })
      .catch(error => console.error("Error deleting event:", error));
}

window.onload = fetchAndDisplayEvents;
