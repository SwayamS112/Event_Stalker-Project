function addEvent() {
    const formData = new FormData(); // Declare formData only once

    // Append form data values
    formData.append("university", document.getElementById("university").value);
    formData.append("department", document.getElementById("department").value);
    formData.append("head", document.getElementById("head").value);
    formData.append("name", document.getElementById("eventName").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("date", document.getElementById("date").value);
    formData.append("logo", document.getElementById("logo").files[0]); // File upload
    formData.append("link", document.getElementById("registrationLink").value);

    // Send the form data to the server
    fetch("/Add_Events", {
        method: "POST",
        body: formData,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to add the event.");
        }
        return response.text();
    })
    .then((message) => {
        alert(message); // Show success message
        clearForm(); // Clear the form after successful submission
    })
    .catch((error) => {
        console.log("Error adding event:", error); // log the error
        alert("Error adding event: " + error.message); // Display error message
    });
}

// Function to reset the form after submission
function clearForm() {
    document.getElementById("eventForm").reset();
}
