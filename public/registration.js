document.getElementById("registration-form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.querySelector('input[name="userType"]:checked').value;
  
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, userType }),
      });
  
      const data = await response.json();
      if (response.status === 200) {
        alert("Registration successful!");
        window.location.href = "/";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error with the registration.");
    }
  });
  