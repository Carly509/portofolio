<p align="center">
<img src="https://codewonders.dev/icons/favicon-96x96.png"/>

<h1 align="center"><a href="https://codewonders.dev">Adenekan Wonderful</a></h1>
<p align="center"> Frontend developer and Javascript engineer</p>

</p>

<img src="https://i.ibb.co/NS0S4XR/image.png"/>

## Running locally in development mode

To get started, just clone the repository and run `npm install && npm run dev`:

    npm install
    npm run dev

Note: If you are running on Windows run install --noptional flag (i.e.
`npm install --no-optional`) which will skip installing fsevents.

## Building and deploying in production

If you wanted to run this site in production, you should install modules then
build the site with `npm run build` and run it with `npm start`:

    npm install
    npm run build
    npm start

You should run `npm run build` again any time you make changes to the site.

Note: If you are already running a webserver on port 80 (e.g. Macs usually have
the Apache webserver running on port 80) you can still start the example in
production mode by passing a different port as an Environment Variable when
starting (e.g. `PORT=3000 npm start`).
