const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage("You: " + message, "user-message");
    userInput.value = "";

    try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_DEEPSEEK_API_KEY"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [{ role: "user", content: message }]
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        addMessage("AI Buddy: " + botMessage, "bot-message");
    } catch (error) {
        console.error("Error:", error);
        addMessage("AI Buddy: Sorry, I couldn't fetch a response.", "bot-message");
    }
}

function addMessage(text, className) {
    const messageElement = document.createElement("div");
    messageElement.className = className;
    messageElement.innerText = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
