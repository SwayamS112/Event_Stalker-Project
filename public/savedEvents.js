document.addEventListener('DOMContentLoaded', () => {
    fetchRegisteredEvents();
  });
  
  async function fetchRegisteredEvents() {
    // **Important:** Replace this with actual user email retrieval (e.g., from local storage)
    const userEmail = "test@example.com";
  
    const eventListContainer = document.getElementById('registeredEventList');
    try {
      const response = await fetch(`/getRegisteredEvents?userEmail=${userEmail}`);
      const events = await response.json();
  
      if (response.ok) {
        displayRegisteredEvents(events);
      } else {
        eventListContainer.innerHTML = "<p>Error fetching registered events.</p>";
      }
    } catch (error) {
      console.error('Error fetching registered events:', error);
      eventListContainer.innerHTML = "<p>An error occurred. Please try again later.</p>";
    }
  }
  
  function displayRegisteredEvents(events) {
    const eventListContainer = document.getElementById('registeredEventList');
    eventListContainer.innerHTML = ''; // Clear previous content
  
    if (events.length === 0) {
      eventListContainer.innerHTML = "<p>You are not registered for any events.</p>";
      return;
    }
  
    events.forEach(event => {
      // Create elements to display event details
      const eventDiv = document.createElement('div');
      eventDiv.classList.add('event'); 
  
      const eventName = document.createElement('h3');
      eventName.textContent = event.name; 
  
      // Add other event details as needed
      const eventDepartment = document.createElement('p');
      eventDepartment.textContent = `Department: ${event.department}`;
  
      // ... Add more elements for other event details ...
  
      eventDiv.appendChild(eventName);
      eventDiv.appendChild(eventDepartment); 
      // ... Append other event detail elements ...
  
      eventListContainer.appendChild(eventDiv);
    });
  }
  
  