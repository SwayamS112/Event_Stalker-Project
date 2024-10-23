const loginButton = document.getElementById("login-button");
const userTypeInput = document.getElementsByName("user-type");

const studentCredentials = [
  { email: 'soodswayam41@gmail.com', password: '123456' },
  { email: 'swayam1424.be22@chitkarauniversity.edu.in', password: '123456' }
];

const staffCredentials = [
  { email: 'vanika30@gmail.com', password: '123456' },
  { email: 'vanika1448.be22@chitkarauniversity.edu.in', password: '123456' }
];

loginButton.addEventListener("click", (event) => {
  event.preventDefault();
  let selectedUserType = '';
  for (let i = 0; i < userTypeInput.length; i++) {
    if (userTypeInput[i].checked) {
      selectedUserType = userTypeInput[i].value;
      break;
    }
  }

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  let validUser = false;
  let userCredentials = [];

  if (selectedUserType === 'student') {
    userCredentials = studentCredentials;
  } else if (selectedUserType === 'staff') {
    userCredentials = staffCredentials;
  }

  for (const user of userCredentials) {
    if (user.email === email && user.password === password) {
      validUser = true;
      break;
    }
  }

  if (validUser) {
    if (selectedUserType === 'student') {
      window.location.href = 'stu.html';
    } else if (selectedUserType === 'staff') {
      window.location.href = 'test.html';
    }
  } else {
    alert('Invalid email or password');
  }
});