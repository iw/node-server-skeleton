# PROJECT_TITLE

## Get it running

* Install [Node][1], NPM and build tools: `apt-get install nodejs nodejs-legacy build-essential`
* Use a node version of `5.0.0` or later (4.x works with `--harmony_destructuring`).
* Configure now, refer to the section about Configuration below.
* Install dependencies with [your favorite package manager][19]
* Use `npm run setup` to perform the initial setup.
* Use `npm start` or a tool like PM2 to run the process. Make sure to set `NODE_ENV`.
* Alternatively, `npm run dev` starts the process in development mode.

## Configuration

Simply `cp config/default.js config/{dest}` where `dest` can be any of the following:

* `local.js`
* `[deployment].js`
* `[deployment]-[instance].js`
* `[hostname].js`
* `[hostname]-[instance].js`
* `[hostname]-[deployment].js`
* `[hostname]-[deployment]-[instance].js`

Configuration files are loaded in the order shown above, where every next file
overrides the previous. Any options that are left out will be loaded from
`default.js`. `local.js` is always loaded, others follow the rules below:

`Deployment` Is matched against the `NODE_ENV` environment variable.

`Instance` Is matched against the `NODE_APP_INSTANCE` environment variable for
different configuration files per cluster instance. Tools like PM2 set the
`NODE_APP_INSTANCE` automatically.

`Hostname` Is matched against the machine host name.

For more information on configuration see [this][2].

### Lower port numbers

On Unix based systems, ports < 1024 require root permissions to bind.
This is a legacy security measure that provides almost no security at all today.

To remove this root requirement for ALL your node applications on Debian, use:

```sh
sudo setcap 'cap_net_bind_service=+ep' `which node`
```

_(`setcap` is in the debian package `libcap2-bin`)_

This approach comes with several caveats as [mentioned here][17]:

* You will need at least a 2.6.24 kernel
* Everything using the same node binary as interpreter will have the same privileges.
* Linux will disable LD_LIBRARY_PATH on any program that has elevated privileges
  like setcap or suid. So if your program uses its own .../lib/, you might have
  to look into another option like port forwarding.

## Documentation

The Skeleton to this application has [a wiki][16] which is gradually growing and
might some day be a userful resource to look at for documentation.

## Tasks

* `npm start`: Start the server in development mode.
* `npm test`: Run linters and tests.
* `npm run clean`: Remove temporary files
* `npm run lint`: Lint the source code. Pass `-- --fix` to apply fixes.
* `npm run pm2`: Start the server in production mode.
* `npm run coverage`: Create a coverage report and open it.
* `npm run coverage:codecov`: Create a coverage report and send it to codecov.

## Stack

### Application

* The http service is provided by [Express][14].
* Data manipulation utilities are provided by [Sanctuary][5].
* Monadic Futures provided by [Fluture][4].
* Runtime type-checking provided by [TComb][13].
* Schema validations in the form of struct-types using [TComb Validations][15].

### Testing

* Code linting with [eslint][12].
* Unit tests with [mocha][6], [chai][7] and [sinon][8].
* Code coverage reports for unit tests using [istanbul][10].


<!-- ## References -->

[1]:   https://nodejs.org/download/
[2]:   https://github.com/lorenwest/node-config/wiki
[3]:   https://github.com/fantasyland/fantasy-land
[4]:   https://github.com/Avaq/Fluture
[5]:   https://sanctuary.js.org/
[6]:   http://mochajs.org/
[7]:   http://chaijs.com/api/bdd/
[8]:   http://sinonjs.org/
[10]:  https://github.com/gotwarlost/istanbul
[12]:  http://eslint.org/
[13]:  https://github.com/gcanti/tcomb
[14]:  http://expressjs.com/4x/api.html
[15]:  https://github.com/gcanti/tcomb-validation
[16]:  https://github.com/Avaq/node-server-skeleton/wiki
[17]:  http://stackoverflow.com/questions/413807/is-there-a-way-for-non-root-processes-to-bind-to-privileged-ports-1024-on-l#answer-414258
[18]:  https://nodesecurity.io/
[19]:  http://gugel.io/ied/
