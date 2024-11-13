document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form from submitting normally

  // Get the email, password, and selected user type
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Get the selected user type (student or staff)
  let selectedUserType = '';
  const userTypeInputs = document.getElementsByName('user-type');
  for (let i = 0; i < userTypeInputs.length; i++) {
    if (userTypeInputs[i].checked) {
      selectedUserType = userTypeInputs[i].value;
      break;
    }
  }

  // Validate inputs
  if (!email || !password || !selectedUserType) {
    alert('Please fill all fields!');
    return;
  }

  try {
    // Send login request to the server
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, userType: selectedUserType })
    });

    if (!response.ok) {
      console.error("Login request failed with status:", response.status);
      const result = await response.json();
      alert(result.message || "An error occurred during login.");
      return;
    }

    // Parse the response and handle successful login
    const result = await response.json();

    if (result.message === "Login successful") {
      // Redirect user based on their userType
      if (selectedUserType === "student") {
        window.location.href = '/student'; // Redirect to the student page
      } else if (selectedUserType === "staff") {
        window.location.href = '/staff'; // Redirect to the staff page
      }
    } else {
      alert(result.message || "An error occurred during login.");
    }
  } catch (error) {
    console.error('Error during fetch:', error);
    alert('An error occurred. Please try again.');
  }
});
