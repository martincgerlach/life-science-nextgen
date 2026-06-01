var signupForm = document.getElementById("signup-form");
var emailInput = document.getElementById("email");
var roleSelect = document.getElementById("role");
var submitButton = document.getElementById("submit-button");
var formMessage = document.getElementById("form-message");

var roles = [
  "Student",
  "PhD",
  "Early-career professional",
  "Mid-stage professional",
  "Other",
];

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.classList.remove("success-message");
  formMessage.classList.remove("error-message");

  if (type === "success") {
    formMessage.classList.add("success-message");
  }

  if (type === "error") {
    formMessage.classList.add("error-message");
  }
}

function emailLooksValid(email) {
  return email.includes("@") && email.includes(".");
}

signupForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  var email = emailInput.value.trim().toLowerCase();
  var role = roleSelect.value;

  if (!emailLooksValid(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  if (!roles.includes(role)) {
    showMessage("Please select your role.", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("Submitting...", "");

  try {
    // fetch sends the form data to the Cloudflare function.
    var response = await fetch("/api/signups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        role: role,
      }),
    });

    var data = await response.json();

    if (data.ok && data.status === "already_registered") {
      signupForm.reset();
      showMessage("You are already registered. Thank you.", "success");
    } else if (data.ok) {
      signupForm.reset();
      showMessage("Thank you. Your signup has been saved.", "success");
    } else {
      showMessage("The signup could not be saved. Please try again.", "error");
    }
  } catch (error) {
    showMessage("The signup could not be saved. Please try again later.", "error");
  }

  submitButton.disabled = false;
});
