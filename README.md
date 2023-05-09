# Simple Point

## Required

- PHP version 7.4.3
- Composer version 2.1.5
- Nodejs version 10.19.0
- Npm version 6.14.4

## Options

- PM2 version 5.1.0 (recomment using on staging environment)
- MySQL server

## Local development environment

1. Clone project

```shell
$ git clone git@github.com:HapoDivOne/simple-point.git && cd simple-point/
```

2. Create .env file

```shell
$ cp server/.env.example server/.env
```

3. Install composer for api server

```shell
$ cd server/ && composer install
```

4. Install npm for frontend server

```shell
$ cd frontend/ && npm install
```

5. Install npm for chat server

```shell
$ cd chat-server/ && npm install
```

6. Config database for api server in _`server/.env`_ file:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306cd
DB_DATABASE=project_db
DB_USERNAME=root
DB_PASSWORD=
```

```shell
$ cd server && php artisan migrate
```

7. Config database for chat server in _`chat-server/mysql.js`_:

```
module.exports = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'project_db'
}
```

8. Start api server

```shell
$ cd server/ && php artisan ser
```

9. Start frontend server

```shell
$ cd frontend/ && npm start
```

10. Start chat server

```shell
$ cd chat-server/ && npm start
```

11. When .env of frontend source file have change, must rebuild and restart npm to accept new changed

```shell
$ cd frontend/ && npm build && npm start
```

12. If you want change PORT for frontend server, modify the scripts part of package.json from:

```shell
"start": "react-scripts start"
```

to

```shell
"start": "PORT=80 react-scripts start"
```

13. Using hotkey `Ctrl + C` or `Control + C` to close api, frontend and chat servers
