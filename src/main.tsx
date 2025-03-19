import './createPost.js';

import { Devvit, Subreddit, useState, useWebView, useForm } from '@devvit/public-api';

import type { DevvitMessage, WebViewMessage } from './message.js';

Devvit.configure({
  redditAPI: true,
  redis: true,
});

// Add a custom post type to Devvit
Devvit.addCustomPostType({
  name: 'Web View Example MY VERY FIRST EXPERIENCE',
  height: 'tall',
  render: (context) => { // FIXED: Removed 'setName' from parameters

    // Load username with `useState` hook
    const [username] = useState(async () => {
      return (await context.reddit.getCurrentUsername()) ?? 'anon';
    });

    console.log(username);

    // Load latest counter from redis with `useState` hook
    const [counter, setCounter] = useState(async () => {
      const redisCount = await context.redis.get(`counter_${context.postId}`);
      return Number(redisCount ?? 0);
    });

    // FIX: Create a local state to store the 'name'
    const [name, setName] = useState("");

    const myForm = useForm(
      {
        fields: [
          {
            type: 'string',
            name: 'name',
            label: 'Your Post',
          },
        ],
      },
      (values) => {
        // onSubmit handler: Update the state variable correctly
        setName(values.name ?? "");
      }
    );

    

    const webView = useWebView<WebViewMessage, DevvitMessage>({
      url: 'index.html',
      async onMessage(message, webView) {
        switch (message.type) {
          case 'webViewReady':
            webView.postMessage({
              type: 'initialData',
              data: {
                username: username,
                currentCounter: counter,
              },
            });
            break;
          case 'setCounter':
            await context.redis.set(
              `counter_${context.postId}`,
              message.data.newCounter.toString()
            );
            setCounter(message.data.newCounter);
            webView.postMessage({
              type: 'updateCounter',
              data: {
                currentCounter: message.data.newCounter,
              },
            });
            break;
          default:
            throw new Error(`Unknown message type: ${message satisfies never}`);
        }
      },
      onUnmount() {
        context.ui.showToast('Ahh shit, here we go again');
      },
    });

    // Render the custom post type
    return (
      <vstack grow padding="small">
        <vstack grow alignment="middle center">
          <text size="xlarge" weight="bold">
            Example App
          </text>
          <spacer />
          <vstack alignment="start middle">
            <hstack>
              <text size="medium">Username:</text>
              <text size="medium" weight="bold">
                {' '}
                {username ?? ''}
              </text>
            </hstack>
            <hstack>
              <text size="medium">Current counter, increase me:</text>
              <text size="medium" weight="bold">
                {' '}
                {counter ?? ''}
              </text>
            </hstack>
            <hstack>
              <text size="medium">Thought:</text>
              <text size="medium" weight="bold">
                {' '}
                {name ?? ''}
              </text>
            </hstack>
          </vstack>
          <spacer />
          <button
            onPress={() => {
              context.ui.showForm(myForm);
            }}
          >
            Post
          </button>
          <button onPress={() => webView.mount()}>Launch</button>
        </vstack>
      </vstack>
    );
  },
});

export default Devvit;
