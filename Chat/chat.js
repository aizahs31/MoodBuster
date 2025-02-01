document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const inputField = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");

    sendButton.onclick = sendMessage;
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    function sendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage === "") return;

        addMessageToChat(userMessage, "user");
        inputField.value = "";

        fetchBotResponse(userMessage);
    }

    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement("div");
        messageDiv.innerText = message;
        messageDiv.classList.add("message");

        if (sender === "user") {
            messageDiv.classList.add("user-message"); 
        } else {
            messageDiv.classList.add("bot-message"); 
        }

        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function fetchBotResponse(userMessage) {
        try {
            const response = await fetch("YOUR_API_ENDPOINT_HERE", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer YOUR_API_KEY_HERE"
                },
                body: JSON.stringify({ message: userMessage })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            addMessageToChat(data.reply, "bot");
        } catch (error) {
            console.error("Error:", error);
            addMessageToChat("Sorry, something went wrong.", "bot");
        }
    }
});