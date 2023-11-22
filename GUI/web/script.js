// Function to show the second page after a delay
function showSecondPage() {
  const secondPageOverlay = document.getElementById('secondPageOverlay');
  secondPageOverlay.style.display = 'block'; // Show the second page overlay
}

// Call the function to show the second page after 5 seconds
setTimeout(showSecondPage, 5000); // 5,000 milliseconds = 5 seconds


// Function to send acknowledgment and trigger machine to go home
function goHome() {
  console.log("Entering goHome function");
  // Get acknowledgment input value
  var ackData = document.getElementById('ack-input').value;

  // Get the selected COM port and baud rate from the UI
  var selectedComPort = document.getElementById('comPortDropdown').value;
  var selectedBaudRate = parseInt(document.getElementById('baudRateDropdown').value);

  // Send acknowledgment to Python
  eel.send_ack(ackData);

  // Clear the input field
  document.getElementById('ack-input').value = '';

  // Trigger machine to go home with the selected COM port and baud rate
  eel.goHome(selectedComPort + ',' + selectedBaudRate, function (receivedData) {
    console.log("Received data from Python:", receivedData);

    // Check if received data contains the required strings in order
    if (receivedData.includes("$G28;") && receivedData.includes("$EZ11;") && receivedData.includes("$EZ10;")) {
      console.log("All required strings present. Showing the third page.");
      // If all required strings are present, show the third page
      showThirdPage();
    } else {
      console.log("Not all required strings present. Not showing the third page.");
    }
  });
}

// Function to show the third page
function showThirdPage() {
  console.log("Showing the third page");
  const thirdPageOverlay = document.getElementById('thirdPageOverlay');
  thirdPageOverlay.style.display = 'block'; // Show the third page overlay
}

eel.expose(showThirdPage);  // Expose the function to Python


// Code to switch to the third page
// var thirdPageOverlay = document.getElementById('thirdPageOverlay');
// var terminalPageOverlay = document.getElementById('terminalPageOverlay');

// Hide the terminal page (if it's currently visible)
// terminalPageOverlay.style.display = 'none';

// Show the third page
// thirdPageOverlay.style.display = 'block';



// Function to go back to the second page
function backToSecondPage() {
  const thirdPageOverlay = document.getElementById("thirdPageOverlay");
  const secondPageOverlay = document.getElementById("secondPageOverlay");

  thirdPageOverlay.style.display = "none";
  secondPageOverlay.style.display = "block";

  document.getElementById("goHome").style.display = "none"; // Hide the machineStatus
  clearInterval(interval);
  document.getElementById("seventhPageOverlay").style.display = "none";
  document.getElementById("secondPageOverlay").style.display = "block";
}
// Function to switch to the fourth page
function goToFourthPage() {
  const thirdPageOverlay = document.getElementById("thirdPageOverlay");
  const fourthPageOverlay = document.getElementById("fourthPageOverlay");

  thirdPageOverlay.style.display = "none";
  fourthPageOverlay.style.display = "block";
}

// Function to go back to the third page from the fourth page
function backToThirdPage() {
  const fourthPageOverlay = document.getElementById("fourthPageOverlay");
  const thirdPageOverlay = document.getElementById("thirdPageOverlay");

  fourthPageOverlay.style.display = "none";
  thirdPageOverlay.style.display = "block";
}

// Function to go to the fifth page from the fourth page
function goToFifthPage() {
  const fourthPageOverlay = document.getElementById("fourthPageOverlay");
  const fifthPageOverlay = document.getElementById("fifthPageOverlay");

  fourthPageOverlay.style.display = "none";
  fifthPageOverlay.style.display = "block";
}

// Function to go back to the fourth page from the fifth page
function backToFourthPage() {
  const fifthPageOverlay = document.getElementById("fifthPageOverlay");
  const fourthPageOverlay = document.getElementById("fourthPageOverlay");

  fifthPageOverlay.style.display = "none";
  fourthPageOverlay.style.display = "block";
}

// Function to start the sixth page from the fifth page
function goTosixthhPage() {
  const fifthPageOverlay = document.getElementById("fifthPageOverlay");
  const sixthPageOverlay = document.getElementById("sixthPageOverlay");

  fifthPageOverlay.style.display = "none";
  sixthPageOverlay.style.display = "block";
}

// Function to go back to the fifth page from the sixth page
function backToFifthPage() {
  const sixthPageOverlay = document.getElementById("sixthPageOverlay");
  const fifthPageOverlay = document.getElementById("fifthPageOverlay");

  sixthPageOverlay.style.display = "none";
  fifthPageOverlay.style.display = "block";
}

// Function to start the seventh page from the sixth page
function goToSeventhPage() {
  const sixthPageOverlay = document.getElementById("sixthPageOverlay").style.display = "none";
  const seventhPageOverlay = document.getElementById("seventhPageOverlay").style.display = "block";

}

let specifiedTime = 0;
let elapsedTime = 0;
let interval;

function setStopwatchTime() {
  const hoursInput = parseInt(document.getElementById("hours").value) || 0;
  const minutesInput = parseInt(document.getElementById("minutes").value) || 0;
  const secondsInput = parseInt(document.getElementById("seconds").value) || 0;

  specifiedTime = (hoursInput * 3600 + minutesInput * 60 + secondsInput) * 1000;
}

function startCountdown() {
  setStopwatchTime();

  let startTime = Date.now() - elapsedTime;
  interval = setInterval(function () {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    updateCountdown();

    if (elapsedTime >= specifiedTime * 1000) {
      clearInterval(interval);
      showPopup();
    }
  }, 1000);
}


function updateCountdown() {
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  document.getElementById("countdownSeventh").textContent = formattedTime;

  // Check if elapsed time is greater than or equal to the specified time and send acknowledgment
  if (elapsedTime >= specifiedTime) {
    clearInterval(interval);
    showPopup();
    sendAcknowledgmentToMachine(seconds);
  }
}

function sendAcknowledgmentToMachine(seconds) {
  // Assuming you have a function to send acknowledgment in your EelUI
  const acknowledgmentCommand = `$M30 S${seconds};`;
  eel.send_ack(acknowledgmentCommand);
}



function backToSixthPage() {
  clearInterval(interval);
  document.getElementById("seventhPageOverlay").style.display = "none";
  document.getElementById("sixthPageOverlay").style.display = "block";
}

function showPopup() {
  document.getElementById("customDialogSeventhPage").style.display = "block";
}
document.getElementById("confirmDialogSeventhPage").addEventListener("click", function () {
  document.getElementById("customDialogSeventhPage").style.display = "none";
});

function resetStopwatch() {
  clearInterval(interval);
  isPaused = false;
  elapsedTime = 0;
  var countdownSeventhElement = document.getElementById("countdownSeventh");
  countdownSeventhElement.textContent = "00:00:00"; // Reset the display to 00:00:00
  countdownSeventhElement.style.color = "orange";
}

// Add event listener for the reset button
document.getElementById("resetStopwatchButton").addEventListener("click", resetStopwatch);

// Function to validate the Focus
function validateInput() {
  var inputElement = document.getElementById("diameterInput");
  var inputValue = inputElement.value;

  // Regular expression to match a decimal number with two decimal places
  var decimalPattern = /^\d+(\.\d{2})?$/;

  if (decimalPattern.test(inputValue)) {
    // Input is valid
    inputElement.style.border = "1px solid green";
    document.getElementById("validationMessage").textContent = "";
    return true;
  } else {
    // Input is not valid
    inputElement.style.border = "1px solid red";
    var validationMessageElement = document.getElementById("validationMessage");
    validationMessageElement.textContent = "Invalid Input";
    validationMessageElement.style.color = "red";

    return false;
  }
}
// Function to open the fifth page overlay
function goToFifthPage() {
  if (validateInput()) {
    // Input is valid, so open the fifth page overlay
    document.getElementById("fourthPageOverlay").style.display = "none"; // Hide the fourth page overlay
    document.getElementById("fifthPageOverlay").style.display = "block"; // Show the fifth page overlay
  } else {
    // Input is not valid, show the custom dialog box for the fourth page
    document.getElementById("customDialog").style.display = "block";
  }
}

// Function to close the custom dialog box
function closeCustomDialog() {
  document.getElementById("customDialog").style.display = "none";
}

// Add an event listener to the input field
document.getElementById("diameterInput").addEventListener("input", validateInput);


// Function to validate the Laser Spot Diameter
function validateInputld() {
  var inputElement = document.getElementById("diameterInput2");
  var inputValue = inputElement.value;

  // Regular expression to match a decimal number with two decimal places
  var decimalPattern = /^\d+(\.\d{2})?$/;

  if (decimalPattern.test(inputValue)) {
    // Input is valid
    inputElement.style.border = "1px solid green";
    document.getElementById("validationMessage2").textContent = "";
    return true;
  } else {
    // Input is not valid
    inputElement.style.border = "1px solid red";
    var validationMessageElement = document.getElementById("validationMessage2");
    validationMessageElement.textContent = "Invalid Input";
    validationMessageElement.style.color = "red";
    return false;
  }
}

// Function to validate the Laser Current
function validateInputlc() {
  var inputElement = document.getElementById("currentInput");
  var inputValue = inputElement.value;

  // Regular expression to match a decimal number with two decimal places
  var decimalPattern = /^\d+(\.\d{2})?$/;

  if (decimalPattern.test(inputValue)) {
    // Input is valid
    inputElement.style.border = "1px solid green";
    document.getElementById("validationMessage3").textContent = "";
    return true;
  } else {
    // Input is not valid
    inputElement.style.border = "1px solid red";
    var validationMessageElement = document.getElementById("validationMessage3");
    validationMessageElement.textContent = "Invalid Input";
    validationMessageElement.style.color = "red";
    return false;
  }
}

// Function to validate the Laser Density
function validateInputlden() {
  var inputElement = document.getElementById("currentInput2");
  var inputValue = inputElement.value;

  // Regular expression to match a decimal number with two decimal places
  var decimalPattern = /^\d+(\.\d{2})?$/;

  if (decimalPattern.test(inputValue)) {
    // Input is valid
    inputElement.style.border = "1px solid green";
    document.getElementById("validationMessage4").textContent = "";
    return true;
  } else {
    // Input is not valid
    inputElement.style.border = "1px solid red";
    var validationMessageElement = document.getElementById("validationMessage4");
    validationMessageElement.textContent = "Invalid Input";
    validationMessageElement.style.color = "red";
    return false;
  }
}

// Function to validate the Object Height
function validateInputoh() {
  var inputElement = document.getElementById("diameterInput3");
  var inputValue = inputElement.value;

  // Regular expression to match a decimal number with two decimal places
  var decimalPattern = /^\d+(\.\d{2})?$/;

  if (decimalPattern.test(inputValue)) {
    // Input is valid
    inputElement.style.border = "1px solid green";
    document.getElementById("validationMessage5").textContent = "";
    return true;
  } else {
    // Input is not valid
    inputElement.style.border = "1px solid red";
    var validationMessageElement = document.getElementById("validationMessage5");
    validationMessageElement.textContent = "Invalid Input";
    validationMessageElement.style.color = "red";
    return false;
  }
}

// Function to open the sixth page overlay
function goToSixthPage() {
  if (validateInputld() && validateInputlc() && validateInputlden() && validateInputoh()) {
    // Both inputs are valid, so open the sixth page overlay
    document.getElementById("fifthPageOverlay").style.display = "none"; // Hide the fifth page overlay
    document.getElementById("sixthPageOverlay").style.display = "block"; // Show the sixth page overlay
  } else {
    // Input is not valid, show the custom dialog box for the fourth page
    document.getElementById("customDialog").style.display = "block";
  }
}

// Function to close the custom dialog box
function closeCustomDialog() {
  document.getElementById("customDialog").style.display = "none";
}

// Add event listeners to the input fields
document.getElementById("diameterInput2").addEventListener("input", validateInputld);
document.getElementById("currentInput").addEventListener("input", validateInputlc);
document.getElementById("currentInput2").addEventListener("input", validateInputlden);
document.getElementById("diameterInput3").addEventListener("input", validateInputoh);


// Function to switch to the setting page when the "COM Setting" button is clicked
function goToSetting() {
  const secondPageOverlay = document.getElementById("secondPageOverlay");
  const settingPageOverlay = document.getElementById("settingPageOverlay");

  secondPageOverlay.style.display = "none";
  settingPageOverlay.style.display = "block";
}

// Define the closeSettingPage function
function closeSettingPage() {
  const secondPageOverlay = document.getElementById("secondPageOverlay");
  const settingPageOverlay = document.getElementById("settingPageOverlay");

  settingPageOverlay.style.display = "none";
  secondPageOverlay.style.display = "block";
}

// Add an event listener to ensure the COM is loaded before running your code
document.addEventListener("COMContentLoaded", function () {
  // Your other JavaScript code here`
});

// Function to handle the "Connect/Disconnect" button action
function connectDisconnect() {
  const comPortDropdown = document.getElementById("comPortDropdown");
  const baudRateDropdown = document.getElementById("baudRateDropdown");
  const connectDisconnectButton = document.getElementById("connectDisconnectButton");

  // Get the selected COM port and baud rate
  const selectedComPort = comPortDropdown.value;
  const selectedBaudRate = baudRateDropdown.value;

  // Print the selected COM port and baud rate to the terminal
  console.log(`Connecting using COM Port: ${selectedComPort}, Baud Rate: ${selectedBaudRate}`);

  // You can add your logic here to connect or disconnect using the selected COM port and baud rate.

  // For example:
  if (connectDisconnectButton.innerText === "Connect") {
    // Perform connection logic
    connectDisconnectButton.innerText = "Disconnect";
  } else {
    // Perform disconnection logic
    connectDisconnectButton.innerText = "Connect";
  }
  // Call the Python function with the selected COM port and baud rate
  eel.connectDisconnect(selectedComPort, selectedBaudRate)();
}


// Function to handle refresh
function refreshCOMPorts() {
  // Call Python function to refresh COM Ports
  eel.refreshCOMPorts()();
}

// Function to update the COM Port dropdown with the received data
eel.expose(updateCOMPorts);
function updateCOMPorts(comPorts) {
  const comPortDropdown = document.getElementById("comPortDropdown");

  // Clear existing options in the COM Port dropdown
  comPortDropdown.innerHTML = '<option value="">Select COM Port</option>';

  // Add dynamically generated options for COM Port
  for (let i = 0; i < comPorts.length; i++) {
    const option = document.createElement("option");
    option.value = comPorts[i];
    option.textContent = comPorts[i];
    comPortDropdown.appendChild(option);
  }
}


// Add dynamically generated options for Baud Rate
const baudRates = ["9600", "19200", "38400", "57600", "115200"];
baudRates.forEach(rate => {
  const option = document.createElement("option");
  option.value = rate;
  option.textContent = rate;
  baudRateDropdown.appendChild(option);
});
eel.refreshCOMPorts()();



// You can add your logic here to refresh the list of available COM ports and baud rates.
// This may involve making requests to the system or external APIs, depending on your requirements.

// You can add event listeners or further functionality as needed.


// Function to apply the theme based on the mode
function applyTheme(mode) {
  const body = document.body;

  if (mode === 'dark') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }
}

/// Function to toggle between dark mode and light mode
function toggleMode() {
  const currentMode = localStorage.getItem('themeMode') || 'light';
  const newMode = currentMode === 'dark' ? 'light' : 'dark';
  localStorage.setItem('themeMode', newMode);
  applyTheme(newMode);

  // Update the icon based on the new mode
  const modeIcon = document.getElementById('modeIcon');
  modeIcon.src = newMode === 'dark' ? 'images/Light-mode-icon.png' : 'images/Dark-mode-icon.png';
  modeIcon.alt = newMode === 'dark' ? 'Light Mode Icon' : 'Dark Mode Icon';

  // Broadcast the theme change to other pages
  window.postMessage({ themeMode: newMode }, '*');
}

// Apply the theme when the page loads
applyTheme(localStorage.getItem('themeMode') || 'light');

// Set the initial icon based on the current mode
const modeIcon = document.getElementById('modeIcon');
modeIcon.src = localStorage.getItem('themeMode') === 'dark' ? 'images/Light-mode-icon.png' : 'images/Dark-mode-icon.png';
modeIcon.alt = localStorage.getItem('themeMode') === 'dark' ? 'Light Mode Icon' : 'Dark Mode Icon';



// Function to switch to the terminal page from the Terminal Button
function goToTerminalPage() {
  const secondPageOverlay = document.getElementById("secondPageOverlay");
  const terminalPageOverlay = document.getElementById("terminalPageOverlay");

  secondPageOverlay.style.display = "none";
  terminalPageOverlay.style.display = "block";
}

// Define the closeTerminalPage function
function closeTerminalPage() {
  const secondPageOverlay = document.getElementById("secondPageOverlay");
  const terminalPageOverlay = document.getElementById("terminalPageOverlay");

  terminalPageOverlay.style.display = "none";
  secondPageOverlay.style.display = "block";
}

// function to sendAck
function sendAck() {
  var ackData = document.getElementById('ack-input').value;
  eel.send_ack(ackData);
  document.getElementById('ack-input').value = '';  // Clear the input field
}

// function to update_data
function update_data(data) {
  var dataDisplay = document.getElementById('data-display');
  dataDisplay.value += data + '\n';
}

// Initialize Eel after the page is loaded
eel.expose(update_data);
eel.ready(() => {
  eel.update_data("Application is ready.");
});













