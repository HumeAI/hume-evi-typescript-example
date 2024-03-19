import {
  VoiceClient,
  createConfig,
  base64ToBlob,
  getAudioStream,
  checkForAudioTracks,
  getSupportedMimeType,
} from '@humeai/voice';

// Safe getElement utility function
function getElementById<T extends HTMLElement>(id: string): T | null {
  const element = document.getElementById(id);
  return element as T | null;
}

const authBtn = getElementById<HTMLButtonElement>('auth-btn');
const startBtn = getElementById<HTMLButtonElement>('start-btn');
const endBtn = getElementById<HTMLButtonElement>('end-btn');
const chat = getElementById<HTMLDivElement>('chat');

let accessToken: string;
let client: VoiceClient | null = null;
const audioQueue: Blob[] = [];

let isPlaying = false;
let currentAudio: HTMLAudioElement | null = null;

let audioStream: MediaStream | null = null;
let recorder: MediaRecorder | null = null;

const result = getSupportedMimeType();
const mimeType = result.success ? result.mimeType : 'audio/webm';

authBtn?.addEventListener('click', authenticate);
startBtn?.addEventListener('click', connect);
endBtn?.addEventListener('click', disconnect);

async function authenticate() {
  const apiKey = import.meta.env.VITE_HUME_API_KEY || '';
  const clientSecret = import.meta.env.VITE_HUME_CLIENT_SECRET || '';
  const host = `localhost:5173`;

  const authString = `${apiKey}:${clientSecret}`;
  const encoded = btoa(authString);
  const protocol = host.includes('localhost:') ? 'http' : 'https';

  try {
    const res = await fetch(`${protocol}://${host}/oauth2-cc/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encoded}`,
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }).toString(),
      cache: 'no-cache',
    });
    const data = (await res.json()) as { access_token: string };
    accessToken = String(data['access_token']);
    if (authBtn) authBtn.disabled = true;
    if (startBtn) startBtn.disabled = false;
  } catch (e) {
    console.error('Failed to authenticate:', e);
  }
}

async function connect() {
  if (startBtn) startBtn.disabled = true;
  if (endBtn) endBtn.disabled = false;

  const config = createConfig({
    auth: {
      type: 'accessToken',
      value: accessToken,
    },
  });

  client = VoiceClient.create(config);

  client.on('open', async () => {
    console.log('Web socket connection opened');
    await captureAudio();
  });

  client.on('message', async (message) => {
    switch (message.type) {
      case 'user_message':
      case 'assistant_message':
        const { role, content } = message.message;
        appendMessage(role, content);
        break;

      case 'audio_output':
        const audioOutput = message.data;
        const blob = base64ToBlob(audioOutput, mimeType);
        audioQueue.push(blob);
        if (audioQueue.length <= 1) {
          await playAudio(mimeType);
        }
        break;

      case 'user_interruption':
        stopAudio();
        break;
    }
  });

  client.on('close', () => {
    console.log('Web socket connection closed');
  });

  client.connect();
}

function disconnect() {
  if (startBtn) startBtn.disabled = false;
  if (endBtn) endBtn.disabled = true;

  stopAudio();

  recorder?.stop();
  recorder = null;
  audioStream = null;

  client?.disconnect();
  appendMessage('system', 'Conversation ended.');
}

async function captureAudio() {
  audioStream = await getAudioStream();
  checkForAudioTracks(audioStream);

  recorder = new MediaRecorder(audioStream, { mimeType });

  recorder.ondataavailable = async ({ data }) => {
    if (data.size > 0 && client?.readyState === WebSocket.OPEN) {
      const buffer = await data.arrayBuffer();
      client?.sendAudio(buffer); // Send the ArrayBuffer through the Web Socket
    }
  };
  recorder.start(100);
}

function playAudio(mimeType: string) {
  if (audioQueue.length > 0 && !isPlaying) {
    isPlaying = true;
    const audioBlob = audioQueue.shift();

    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      currentAudio = new Audio(audioUrl);
      currentAudio.play();

      currentAudio.onended = async () => {
        isPlaying = false;
        if (audioQueue.length) playAudio(mimeType);
      };
    }
  }
}

function stopAudio() {
  currentAudio?.pause();
  currentAudio = null;
  isPlaying = false;
  audioQueue.length = 0;
}

function appendMessage(role: string, content: string) {
  const timestamp = new Date().toLocaleTimeString();
  const messageEl = document.createElement('p');
  messageEl.innerHTML = `<strong>[${timestamp}] ${role}:</strong> ${content}`;
  chat?.appendChild(messageEl);
}
