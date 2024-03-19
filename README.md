<div align="center">
  <img src="https://storage.googleapis.com/hume-public-logos/hume/hume-banner.png">
  <h1>Empathic Voice Interface | Sample Implementation</h1>
  <p>
    <strong>Jumpstart your development with Hume's Empathic Voice Interface!</strong>
  </p>
</div>

## Overview

This project features a sample implementation of Hume's [Empathic Voice Interface](https://hume.docs.buildwithfern.com/docs/empathic-voice-interface-evi/overview) using Hume's Typescript SDK.

## Prerequisites

To run this project locally, ensure your development environment meets the following requirements:

- [Node.js](https://nodejs.org/en) (`v18.0.0` or higher).
- [pnpm](https://pnpm.io/installation) (`v8.0.0` or higher)

To check the versions of `pnpm` and `Node.js` installed on a Mac via the terminal, you can use the following commands:

1. **For Node.js**, enter the following command and press Enter:

```bash
node -v
```

This command will display the version of Node.js currently installed on your system, for example, `v21.6.1`.

2. **For pnpm**, type the following command and press Enter:

```bash
pnpm -v
```

This command will show the version of `pnpm` that is installed, like `8.10.0`.

If you haven't installed these tools yet, running these commands will result in a message indicating that the command was not found. In that case, you would need to install them first. Node.js can be installed from its official website or via a package manager like Homebrew, and `pnpm` can be installed via npm (which comes with Node.js) by running `npm install -g pnpm` in the terminal.

Next you'll need to set your environment variables necessary for authentication. You'll need your API key and client secret which are accessible from the portal. See our documentation on [getting your api keys](https://hume.docs.buildwithfern.com/docs/introduction/getting-your-api-key).

After obtaining your API keys run the following commands to set your environment variables.

```sh
export VITE_HUME_API_KEY=<YOUR_API_KEY>
export VITE_HUME_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
```

## Serve project

Below are the steps to run the project locally:

1. Run `pnpm i` to install required dependencies.
2. Run `pnpm build` to build the project.
3. Run `pnpm dev` to serve the project at `localhost:5173`.

## Usage

This implementation of Hume's Empathic User Interface (EVI) is minimal, using default configurations for the interface and a basic UI to authenticate, connect to, and disconnect from the interface.

1. Click the `Authenticate` button to fetch your access token. This step is neccessary to establish an authenticated connection with the interface.
2. Click the `Start` button to establish an authenticated connection and to begin capturing audio.
3. Upon clicking start, you will be prompted for permissions to use your microphone. Grant the permission to the application to continue.
4. Once permission is granted, you can begin speaking with the interface. The transcript of the conversation will be displayed on the webpage in realtime.
5. Click `Disconnect` when finished speaking with the interface to stop audio capture and to disconnect the Web Socket.
