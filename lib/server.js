// const pm2 = require('pm2')
const mime = require('mime-types');
var http = require('http');
var fs = require('fs');
const url = require('url');
const build = require('./utils/build.js')

const functions = {
  start,
  build,
}

module.exports = async (argv) => {
  try{

    if (argv._.length === 1) throw new Error('No operation specified')
    
    const operation = argv._[1]
    if (!functions[operation]) throw new Error(`Unknown operation: ${operation}`)
    
    await functions[operation](argv)
  } catch (e) {
    console.error(e.message || e)
    process.exit(1)
  }
}

const path = require('path');

function startServer(argv) {
  const { port = 9615 } = argv || {}

  const index = fs.readFileSync(path.join(__dirname, '..', 'dist', 'index.html'));

  http.createServer(function (req, res) {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(index);
      return;
    }

    const filePath = path.join(__dirname, '..', 'dist', parsedUrl.pathname);

    try {
      // verify if url is a file in dist folder
      if (fs.existsSync(filePath)) {
        const contentType = mime.lookup(filePath) || 'text/plain';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fs.readFileSync(filePath));
        return;
      }
    } catch (error) {
      console.error(`Erro ao servir arquivo ${filePath}:`, error);
      //res.writeHead(200, { 'Content-Type': 'text/html' });
      //res.end(index);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(index);
  }).listen(port);

  console.log('🚀  Server start');
  console.log('🚀  Server listening on port ' + port);
}

async function start(argv) {
  await build();
  startServer(argv);
}

