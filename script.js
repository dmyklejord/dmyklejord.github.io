const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const clearButton = document.getElementById('clear-button');
const loadingIndicator = document.getElementById('loading-indicator');
const searchWidgetTrigger = document.getElementById('searchWidgetTrigger');

let lastQueryTime = 0;
let followUpCount = 0;
const maxFollowUps = 5;

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isUser ? 'user-message' : 'ai-message');
    messageElement.textContent = message;
    chatHistory.appendChild(messageElement);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function clearConversation() {
    chatHistory.innerHTML = '';
    followUpCount = 0;
}

function showError(error) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error-message');
    errorElement.innerHTML = `Error: ${error.message} <span>(Click to show details)</span>`;
    
    const errorDetails = document.createElement('div');
    errorDetails.classList.add('error-details');
    errorDetails.textContent = JSON.stringify(error, null, 2);
    
    errorElement.appendChild(errorDetails);
    chatHistory.appendChild(errorElement);
    
    errorElement.addEventListener('click', () => {
        errorDetails.style.display = errorDetails.style.display === 'none' ? 'block' : 'none';
    });
}

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    const currentTime = Date.now();
    if (currentTime - lastQueryTime < 5000) {
        alert('Please wait 5 seconds before sending another message.');
        return;
    }

    addMessage(message, true);
    userInput.value = '';
    loadingIndicator.style.display = 'flex';
    sendButton.disabled = true;

    try {
        // Trigger the search widget
        searchWidgetTrigger.value = message;
        searchWidgetTrigger.click();
        
        // Wait for the response
        const response = await new Promise((resolve) => {
            const searchWidget = document.querySelector('gen-search-widget');
            searchWidget.addEventListener('widgetClosed', (event) => {
                resolve(event.detail.data);
            }, { once: true });
        });

        if (response && response.length > 0) {
            addMessage(response[0].snippet, false);
        } else {
            addMessage("I'm sorry, I couldn't find an answer to your question.", false);
        }

        followUpCount++;

        if (followUpCount >= maxFollowUps) {
            addMessage("You've reached the maximum number of follow-up questions. Starting a new conversation.", false);
            followUpCount = 0;
        }
    } catch (error) {
        showError(error);
    } finally {
        loadingIndicator.style.display = 'none';
        lastQueryTime = Date.now();
        setTimeout(() => {
            sendButton.disabled = false;
        }, 5000);
    }
}

sendButton.addEventListener('click', sendMessage);
clearButton.addEventListener('click', clearConversation);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

window.addEventListener('load', clearConversation);