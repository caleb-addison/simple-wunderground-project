# Overview

This is a simple react project that provides a minimal gui for interacting with the [weather underground](https://www.wunderground.com/) API.

An API key is required to use this project. This is available to weather underground users who have linked their personal weather station. [Go here](https://www.wunderground.com/member/api-keys) to generate your API key. You'll also need to know your station ID, which you can view in the _My Devices_ section of your profile.

I'm not a React developer so don't @ me if the code isn't the best.

## Running the app

Clone the repo and open it using VS Code.

You can run the app using `npm start`

Note that when running on local host you might run into CORS issues when trying to query the wunderground APIs. I had to **disable** this flag in Chrome to for it to work:
`chrome://flags/#block-insecure-private-network-requests`

## Building and deploying

Build the app with `npm run build`

I'm using Firebase to host it, which I deploy using `firebase deploy --only hosting`
