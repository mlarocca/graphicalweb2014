var connect = require('connect'),
    http = require('http'),
    directory = './public',
    port = process.env.PORT || 8080;

connect()
    .use(connect.static(directory))
    .listen(port);

process.on('uncaughtException', function (err) {
    console.log(err);
}); 
console.log('Listening on port ' + port + '...');