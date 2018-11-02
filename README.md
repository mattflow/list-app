# List App

Application for creating simple checklists. I am making this mainly because my mom keeps asking for a grocery app.

Client can be found [here](client).

## Development

Starting up the server and client for development is easy. Just use `yarn dev` or `npm run dev`.

## Production

I will not give the URL that my app is running on since my parents are using it for their groceries,
but deploying your own version of this app is also very easy.

I will assume you are using `yarn` for this.

Make sure you have the heroku cli tool installed and you are logged in.

then:

```sh
heroku create application-name
heroku git:remote -a application-name
yarn deploy # or npm run deploy
```

If you don't set a `LOGGING_TYPE` environment variable it will log in development mode.
You can also change `PORT` if you want to serve it from a different port.

If you just want to start the production app, use `yarn start`.