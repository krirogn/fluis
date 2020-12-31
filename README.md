# fluis

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## Roadmap
### Supported platforms
- [ ] Web
- [ ] iPhone/Android
- [ ] [WebOS](http://webostv.developer.lge.com/)
- [ ] AppleTV
- [ ] Philips SmartTV

## How it works
### Frontend (Selfhosted Web)
Is a static Nuxt SSP that can be statically
hosted with services like Netlify and others.

To do this one must first clone the source code
to it's own repository, and then you change
the config file, and then you can host it.

### Frontend (Closed source solution)
Simply enter the URL to the web frontend
when you open the app, and then enter
username and password like you normally do.

### Backend
Is an Apache PHP server that conatins all
the sensitive information like user files,
and handles all the logic.

### Media
Is stored on an Object Storage S3 bucket with
a specific structure, but the backend will
initialize that at startup. 