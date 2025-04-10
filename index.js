setTimeout(() => {
  document.getElementById("main").classList.add("rotate");
}, 2000);


const icons = document.querySelectorAll("#icons i");
const closedoor = document.getElementById("close-door");
const openDoorBtn = document.getElementById("open-door");
const slider = document.getElementById("slider");
const mainContent = document.getElementById("main-content");
const chat=document.querySelector("#chat");
const innerchat=document.querySelector("#innerchat");
const chatbox=document.querySelector("#chatbox");
const maindiv=document.querySelector("#main");
const ele=document.createElement("p");
ele.innerText="ChatNova";
ele.style.marginLeft="20px";
// Function to toggle slider
function toggleSlider(action) {
    if (action === "open") {
        slider.style.width = "250px";
        
        icons.forEach(item => item.style.display = "none");
        maindiv.after(ele);
    } else if (action === "close") {
        slider.style.width = "0px";
        icons.forEach(item => item.style.display = "");
        ele.remove();
    }
}

// Open button event
openDoorBtn.addEventListener("click", function () {
    if (slider.style.width === "250px") {
        toggleSlider("close");
        
    } else {
        toggleSlider("open");
        
    }
});

// Close button event
closedoor.addEventListener("click", function () {
    toggleSlider("close");
   
});

if (chat) {
  chat.addEventListener("click", () => {
    location.reload(); // This refreshes the page, starting a "new chat"
  });
}
if (innerchat) {
  innerchat.addEventListener("click", () => {
    location.reload(); // This refreshes the page, starting a "new chat"
  });
}
if (chatbox) {
    chatbox.addEventListener("click", () => {
    location.reload(); // This refreshes the page, starting a "new chat"
  });
}

const search=document.querySelector("#search");
const wraper=document.querySelector("#wraper");
const cancel=document.querySelector("#cancel");


search.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent click from bubbling up
  wraper.classList.add("active");
});

// Collapse wrapper on cancel click
cancel.addEventListener("click", (e) => {
  e.stopPropagation();
  wraper.classList.remove("active");
});

// Collapse wrapper on clicking anywhere else on screen
document.addEventListener("click", (e) => {
  if (!wraper.contains(e.target) && !search.contains(e.target)) {
      wraper.classList.remove("active");
  }
});


const upgrade=document.querySelector("#upgrade");
const subscription=document.querySelector("#subscription");
const close=document.querySelector("#close");


upgrade.addEventListener("click", () => {
  subscription.classList.add("active");
});

close.addEventListener("click", () => {
  subscription.classList.remove("active");
});




const showGuidelines = document.querySelector("#show-guidelines");
const guidelines = document.querySelector("#guidelines");
const closeGuidelines = document.querySelector("#close-guidelines");

showGuidelines.addEventListener("click", () => {
  guidelines.classList.add("active");
});

closeGuidelines.addEventListener("click", () => {
  guidelines.classList.remove("active");
});
















const line = document.querySelector(".content h2");
const chatContainer = document.getElementById("chatContainer");
const plane=document.querySelector("#plane");
const userInput=document.querySelector("#userInput");
const voiceButton = document.getElementById("voiceButton");

chatContainer.style.display = "none";

const chatnova=document.createElement("h3");
chatnova.innerText="ChatNova";
line.before(chatnova);
chatnova.style.display="none";

// Toggle plane/voice button based on input
userInput.addEventListener("input", () => {
  if (userInput.value.trim() !== "") {
    plane.style.display = "inline-block";
    voiceButton.style.display = "none";
  } else {
    plane.style.display = "none";
    voiceButton.style.display = "inline-block";
  }
});

// Send on Enter
userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Send on Plane Click
plane.addEventListener("click", function () {
  sendMessage();
});

async function loadChatHistory() {
  const chatHistoryContainer = document.getElementById("chat-history");
  const chatContainer = document.getElementById("chatContainer");
  chatHistoryContainer.innerHTML = "";
  const token = localStorage.getItem("admin_token");

  try {
    const response = await fetch("http://localhost:5000/admin/logs", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    const data = await response.json();
    const logs = data.logs;

    const seenDates = new Set();
    let sessionStarted = false;
    let currentSession = [];
    let sessionIndex = 0;

    logs.forEach((line, i) => {
      const [timestampRaw, messagePart] = line.split("] ");
      const timestamp = new Date(timestampRaw.replace("[", ""));
      const dateStr = timestamp.toDateString();
      const timeStr = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      currentSession.push({ line, timeStr });

      if (line.includes("User:") && !sessionStarted) {
        sessionStarted = true;
        const previewText = messagePart.replace("User: ", "").slice(0, 15) + "...";

        // Show date only once
        if (!seenDates.has(dateStr)) {
          const dateHeader = document.createElement("div");
          dateHeader.className = "chat-date";
          dateHeader.textContent = dateStr;
          chatHistoryContainer.appendChild(dateHeader);
          seenDates.add(dateStr);
        }

        // Create preview div
        const previewDiv = document.createElement("div");
        previewDiv.className = "message preview";
        previewDiv.innerHTML = `<strong>${previewText}</strong> <span class="time">${timeStr}</span>`;
        previewDiv.dataset.session = JSON.stringify(currentSession);
        chatHistoryContainer.appendChild(previewDiv);

        previewDiv.addEventListener("click", () => {
          chatContainer.innerHTML = ""; // Clear previous chat

          currentSession.forEach(({ line, timeStr }) => {
            const messageDiv = document.createElement("div");
            messageDiv.classList.add("message");

            if (line.includes("User:")) {
              messageDiv.classList.add("history-user"); // Left aligned, no background
              messageDiv.innerText = line.split("User: ")[1];
            } else if (line.includes("Bot:")) {
              messageDiv.classList.add("history-bot"); // Bot style
              messageDiv.innerText = line.split("Bot: ")[1];
            }

            chatContainer.appendChild(messageDiv);
          });

          chatContainer.scrollTop = chatContainer.scrollHeight;
        });

        sessionIndex++;
      }

      if (line.includes("Bot:") && sessionStarted) {
        sessionStarted = false;
        currentSession = [];
      }
    });

  } catch (error) {
    console.error("Failed to load history:", error);
  }
}



window.onload = function () {
  loadChatHistory(); // make sure this is after chatContainer is declared in HTML
};



// Send Message Function
async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  plane.style.display = "none";
  voiceButton.style.display = "inline-block";
  line.style.display = "none";
  chatContainer.style.display = "";
  chatnova.style.display="";

  // Show user message
  const userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.innerText = input;
  chatContainer.appendChild(userMessage);

  userInput.value = "";
  chatContainer.scrollTop = chatContainer.scrollHeight;
  
  // Show typing indicator
  const typingBubble = document.createElement("div");
  typingBubble.className = "message bot-message typing-indicator";
  typingBubble.innerHTML = `
    <span></span><span></span><span></span>
  `;
  chatContainer.appendChild(typingBubble);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const response = await fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question: input })
    });

    const data = await response.json();

    // Remove typing bubble
    typingBubble.remove();

    if (data.error) {
      console.error("Server Error:", data.error);
      return;
    }

    // Show bot response
    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.innerText = data.answer;
    chatContainer.appendChild(botMessage);
    chatContainer.scrollTop = chatContainer.scrollHeight;

  } catch (error) {
    console.error("Error fetching response:", error);
    typingBubble.remove();

    const botMessage = document.createElement("div");
    botMessage.className = "message bot-message";
    botMessage.innerText = "Oops! Something went wrong.";
    chatContainer.appendChild(botMessage);
  }
}



const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  voiceButton.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onstart = () => {
    console.log("Voice recognition started...");
    voiceButton.style.color = "red";
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("Transcript:", transcript);

    const chatInput = document.getElementById("userInput");
    chatInput.value = transcript;

    sendMessage(); // ⬅️ This line sends the spoken message
    voiceButton.style.color = "";
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    voiceButton.style.color = "";
  };

  recognition.onend = () => {
    console.log("Voice recognition ended.");
    voiceButton.style.color = "";
  };
} else {
  alert("Your browser does not support voice recognition.");
}




const scrollDownBtn = document.getElementById("scrollDown");
const scrollButtons = document.getElementById("scroll-buttons");

function updateScrollButtonVisibility() {
  const atBottom = chatContainer.scrollTop + chatContainer.clientHeight >= chatContainer.scrollHeight - 5;
  const hasOverflow = chatContainer.scrollHeight > chatContainer.clientHeight;

  if (hasOverflow && !atBottom) {
    scrollButtons.style.display = "flex";
  } else {
    scrollButtons.style.display = "none";
  }
}

// Scroll to bottom when arrow clicked
scrollDownBtn.addEventListener("click", () => {
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
});

// Update on scroll
chatContainer.addEventListener("scroll", updateScrollButtonVisibility);

// Observe DOM changes in chatContainer
const observer = new MutationObserver(updateScrollButtonVisibility);
observer.observe(chatContainer, { childList: true, subtree: true });

// Also call on initial load
updateScrollButtonVisibility();













const emojiBtn = document.getElementById("emojiPickerBtn");
const fileBtn = document.getElementById("fileUploadBtn");
const fileInput = document.getElementById("fileInput");
const emojiPopup = document.getElementById("emojiPopup");

// Toggle emoji picker
emojiBtn.addEventListener("click", () => {
  emojiPopup.style.display = emojiPopup.style.display === "none" ? "block" : "none";
});



// Add emoji to input on click
emojiPopup.addEventListener("click", (e) => {
  if (e.target.tagName === "SPAN") {
    userInput.value += e.target.textContent;
    emojiPopup.style.display = "none";
    userInput.focus();
  }
});


// Trigger file picker
fileBtn.addEventListener("click", () => {
  fileInput.click();
  emojiPopup.style.display="none"
});

// Handle file selection
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    alert(`You selected: ${file.name}`);
    // You can append it to the chat here or send it to server
  }
});

document.addEventListener("click", function (event) {
  const emojiBtn = document.getElementById("emojiPickerBtn");
  const emojiPopup = document.getElementById("emojiPopup");

  // Check if the click is outside emoji button and popup
  if (!emojiPopup.contains(event.target) && !emojiBtn.contains(event.target)) {
    emojiPopup.style.display = "none";
  }
});








