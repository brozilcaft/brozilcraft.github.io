// TechUrdu Custom AI Chatbot

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject CSS Styles
    const style = document.createElement('style');
    style.innerHTML = `
        #techurdu-chatbot-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6C63FF, #00D9FF);
            color: white;
            border: none;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(108, 99, 255, 0.4);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease;
        }
        #techurdu-chatbot-btn:hover {
            transform: scale(1.1);
        }
        
        #techurdu-chatbot-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 450px;
            background-color: #0a0a0f;
            border: 1px solid rgba(108, 99, 255, 0.3);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            display: none;
            flex-direction: column;
            z-index: 1000;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
            color: #f5f5f7;
            animation: chatSlideUp 0.3s ease forwards;
        }

        @keyframes chatSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #chat-header {
            background: linear-gradient(135deg, #6C63FF, #4b45cc);
            padding: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
        }

        #chat-close-btn {
            background: transparent;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
        }

        #chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .chat-bubble {
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.4;
            word-wrap: break-word;
        }

        .bot-message {
            background-color: #1a1a24;
            color: #f5f5f7;
            align-self: flex-start;
            border-bottom-left-radius: 2px;
            border: 1px solid rgba(108, 99, 255, 0.2);
        }

        .user-message {
            background-color: #6C63FF;
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 2px;
        }

        .chat-suggestions {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            margin-top: 10px;
        }

        .suggestion-btn {
            background-color: transparent;
            border: 1px solid #00D9FF;
            color: #00D9FF;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .suggestion-btn:hover {
            background-color: #00D9FF;
            color: #0a0a0f;
        }

        #chat-input-area {
            display: flex;
            padding: 10px;
            background-color: #1a1a24;
            border-top: 1px solid rgba(108, 99, 255, 0.2);
        }

        #chat-input {
            flex: 1;
            background: transparent;
            border: none;
            color: white;
            padding: 8px;
            font-size: 14px;
            outline: none;
        }

        #chat-send-btn {
            background: #6C63FF;
            color: white;
            border: none;
            border-radius: 6px;
            padding: 8px 12px;
            cursor: pointer;
            transition: background 0.2s;
        }

        #chat-send-btn:hover {
            background: #4b45cc;
        }

        .typing-indicator {
            display: none;
            align-self: flex-start;
            background-color: #1a1a24;
            padding: 10px 14px;
            border-radius: 12px;
            border-bottom-left-radius: 2px;
            border: 1px solid rgba(108, 99, 255, 0.2);
        }

        .dot {
            display: inline-block;
            width: 6px;
            height: 6px;
            background-color: #6C63FF;
            border-radius: 50%;
            margin: 0 2px;
            animation: bounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }

        /* Scrollbar */
        #chat-messages::-webkit-scrollbar { width: 6px; }
        #chat-messages::-webkit-scrollbar-track { background: #0a0a0f; }
        #chat-messages::-webkit-scrollbar-thumb { background: #6C63FF; border-radius: 10px; }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML Structure
    const chatbotContainer = document.createElement('div');
    chatbotContainer.innerHTML = `
        <button id="techurdu-chatbot-btn">
            <i class="fa-solid fa-robot"></i>
        </button>
        <div id="techurdu-chatbot-window">
            <div id="chat-header">
                <div><i class="fa-solid fa-robot" style="margin-right: 8px;"></i> TechUrdu AI</div>
                <button id="chat-close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="chat-messages">
                <div class="chat-bubble bot-message">
                    Assalam u Alaikum! 👋 Main TechUrdu ka AI assistant hoon. Kaise madad kar sakta hoon?
                    <div class="chat-suggestions">
                        <button class="suggestion-btn">AI kya hai?</button>
                        <button class="suggestion-btn">Python seekhni hai</button>
                        <button class="suggestion-btn">Online Earning</button>
                    </div>
                </div>
                <div class="typing-indicator" id="typing-indicator">
                    <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                </div>
            </div>
            <div id="chat-input-area">
                <input type="text" id="chat-input" placeholder="Yahan message likhein..." autocomplete="off">
                <button id="chat-send-btn"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    // 3. Logic and Interactivity
    const chatBtn = document.getElementById('techurdu-chatbot-btn');
    const chatWindow = document.getElementById('techurdu-chatbot-window');
    const closeBtn = document.getElementById('chat-close-btn');
    const sendBtn = document.getElementById('chat-send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    // Toggle window
    chatBtn.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    // Send Message on click or Enter
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    // Suggestion Buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-btn')) {
            chatInput.value = e.target.innerText;
            handleSendMessage();
        }
    });

    function handleSendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Append user message
        appendMessage(text, 'user');
        chatInput.value = '';

        // Show typing indicator
        chatMessages.appendChild(typingIndicator); // Move to bottom
        typingIndicator.style.display = 'block';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate network delay and respond
        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const response = getBotResponse(text);
            appendMessage(response, 'bot');
        }, 1000 + Math.random() * 1000);
    }

    function appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = \`chat-bubble \${sender}-message\`;
        msgDiv.innerHTML = text;
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 4. Smart Responses (Keyword based)
    function getBotResponse(input) {
        let text = input.toLowerCase();

        if (text.includes('salam') || text.includes('assalam') || text.includes('hello') || text.includes('hi')) {
            return 'Walaikum Assalam! 👋 Main aapki kya madad kar sakta hoon tech ya AI ke hawaley se?';
        }
        else if (text.includes('ai kya hai') || text.includes('what is ai')) {
            return 'AI (Artificial Intelligence) ka matlab hai computers ko insaano ki tarah sochne aur samajhne ke qabil banana. Aap humara blog post "AI Kya Hai?" parh sakte hain details ke liye!';
        }
        else if (text.includes('python') || text.includes('programming')) {
            return 'Python ek bohot popular aur asaan programming language hai jo AI aur data science mein use hoti hai. Hamari website pe "Python Programming Seekhein" guide mojood hai.';
        }
        else if (text.includes('earning') || text.includes('paisa') || text.includes('kamayein')) {
            return 'AI se earning ke bohot tareeqe hain jaise Freelancing, YouTube automation, aur AI art selling. Humne ek poori post likhi hai "2026 Mein AI Se Paisa Kaise Kamayein" par.';
        }
        else if (text.includes('tools') || text.includes('chatgpt')) {
            return 'ChatGPT, Canva AI, aur Notion AI kuch best free tools hain. Mazeed janne ke liye "Top 10 Free AI Tools" wali post check karein!';
        }
        else if (text.includes('blog') || text.includes('topics')) {
            return 'Hum AI, Programming, Tools, Earning aur Tutorials par blog posts likhte hain. Website scroll karein aur posts read karein.';
        }
        else if (text.includes('shukriya') || text.includes('thanks') || text.includes('thank you')) {
            return 'You are welcome! Agar koi aur sawal ho toh zaroor poochein. Happy Learning! 🚀';
        }
        else {
            return 'Maaf kijiyega, main samajh nahi paya. Kya aap AI, Python, ya Online Earning ke baare mein kuch poochna chahte hain?';
        }
    }
});
