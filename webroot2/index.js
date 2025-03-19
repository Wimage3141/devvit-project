// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './app.js'

// alert("index.js is running!");
// console.log("index.js is running!");

// const root = ReactDOM.createRoot(document.getElementById('app'));
// root.render(<App />);






































/** @typedef {import('../src/message.ts').DevvitSystemMessage} DevvitSystemMessage */
/** @typedef {import('../src/message.ts').WebViewMessage} WebViewMessage */

class App {
  constructor() {
    // Get references to the HTML elements
    this.output = /** @type {HTMLPreElement} */ (document.querySelector('#messageOutput'));
    this.increaseButton = /** @type {HTMLButtonElement} */ (
      document.querySelector('#btn-increase')
    );
    this.decreaseButton = /** @type {HTMLButtonElement} */ (
      document.querySelector('#btn-decrease')
    );
    this.usernameLabel = /** @type {HTMLSpanElement} */ (document.querySelector('#username'));
    this.counterLabel = /** @type {HTMLSpanElement} */ (document.querySelector('#counter'));
    this.counter = 0;


    // When the Devvit app sends a message with `postMessage()`, this will be triggered
    addEventListener('message', this.#onMessage);

    // This event gets called when the web view is loaded
    addEventListener('load', () => {
      postWebViewMessage({ type: 'webViewReady' });
    });

    this.increaseButton.addEventListener('click', () => {
      // Sends a message to the Devvit app
      postWebViewMessage({ type: 'setCounter', data: { newCounter: this.counter + 1 } });
    });

    this.decreaseButton.addEventListener('click', () => {
      // Sends a message to the Devvit app
      postWebViewMessage({ type: 'setCounter', data: { newCounter: this.counter - 1 } });
    });
  }

  /**
   * @arg {MessageEvent<DevvitSystemMessage>} ev
   * @return {void}
   */
  #onMessage = (ev) => {
    // Reserved type for messages sent via `context.ui.webView.postMessage`
    if (ev.data.type !== 'devvit-message') return;
    const { message } = ev.data.data;

    // Always output full message
    this.output.replaceChildren(JSON.stringify(message, undefined, 2));

    switch (message.type) {
      case 'initialData': {
        // Load initial data
        const { username, currentCounter } = message.data;
        this.usernameLabel.innerText = username;
        this.counter = currentCounter;
        this.counterLabel.innerText = `${this.counter}`;
        break;
      }
      case 'updateCounter': {
        const { currentCounter } = message.data;
        this.counter = currentCounter;
        this.counterLabel.innerText = `${this.counter}`;
        break;
      }
      default:
        /** to-do: @satisifes {never} */
        const _ = message;
        break;
    }
  };
}

/**
 * Sends a message to the Devvit app.
 * @arg {WebViewMessage} msg
 * @return {void}
 */
function postWebViewMessage(msg) {
  parent.postMessage(msg, '*');
}

new App();




// prev CSS
// :root {
//   --primary-color: #6b7280;
//   --background-color: #f3f4f6;
//   --text-color: #374151;
//   --accent-color: #60a5fa;
//   --border-radius: 6px;
//   --shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
// }

// body {
//   display: flex;
//   flex-direction: column;
//   gap: 0.75rem;
//   padding: 1rem;
//   max-width: 650px;
//   margin: 0 auto;
//   min-height: 100vh;
//   background-color: var(--background-color);
//   color: var(--text-color);
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
//   line-height: 1.3;
//   position: fixed;
//   width: 100%;
//   height: 100%;
// }

// h1,
// h2,
// h3 {
//   margin: 0;
//   color: var(--primary-color);
// }

// h1 {
//   font-size: 1.8rem;
//   font-weight: 700;
//   margin-bottom: 0.5rem;
// }

// h2 {
//   font-size: 1.3rem;
//   font-weight: 600;
// }

// h3 {
//   font-size: 1.1rem;
//   font-weight: 500;
// }

// #username,
// #counter {
//   color: var(--accent-color);
//   font-weight: 600;
// }

// /* New button container */
// .button-container {
//   display: flex;
//   gap: 0.5rem;
//   width: 100%;
// }

// button {
//   flex: 1;
//   padding: 0.5rem 1rem;
//   border: none;
//   border-radius: var(--border-radius);
//   background-color: var(--accent-color);
//   color: white;
//   font-size: 0.9rem;
//   font-weight: 500;
//   cursor: pointer;
//   transition:
//     transform 0.2s,
//     box-shadow 0.2s;
//   box-shadow: var(--shadow);
//   margin: 0;
// }

// button:hover {
//   transform: translateY(-1px);
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// }

// button:active {
//   transform: translateY(0);
// }

// #btn-decrease {
//   background-color: var(--primary-color);
// }

// pre {
//   background-color: white;
//   padding: 0.75rem;
//   border-radius: var(--border-radius);
//   box-shadow: var(--shadow);
//   overflow-x: auto;
//   font-family: 'Courier New', Courier, monospace;
//   border: 1px solid #e5e7eb;
//   font-size: 0.9rem;
//   margin: 0;
// }

// .main-text-box {
//   height: 300px;
// }

// @media (max-width: 640px) {
//   body {
//     padding: 0.75rem;
//     gap: 0.5rem;
//   }

//   h1 {
//     font-size: 1.5rem;
//   }
// }
