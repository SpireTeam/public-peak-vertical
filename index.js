/* eslint-disable no-console */
const cluster = require('cluster');
const program = require('commander');
const os = require('os');
const util = require('util');

const debug = util.debuglog('peak-api');

program
  .option('-e, --environment <env>', 'Node Environment (defaults to development)')
  .option('-w, --workers <n>', 'Number of workers (defaults to number of CPUs)', parseInt)
  .option('-p, --port <n>',
    'Port to run server on (should really be specified in config/services.json)', parseInt)
  .parse(process.argv);

if (program.environment) {
  process.env.NODE_ENV = program.environment;
}

const numWorkers = parseInt(program.workers, 10) || os.cpus().length;

if (cluster.isMaster) {
  // Fork workers. One per CPU for maximum effectiveness
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (deadWorker) => {
    // Restart the worker
    const worker = cluster.fork();

    // Note the process IDs
    const newPID = worker.process.pid;
    const oldPID = deadWorker.process.pid;

    // Log the event
    debug(`worker ${oldPID} died.`);
    debug(`worker ${newPID} born.`);
  });
} else {
  if (program.port) {
    process.env.PORT = program.port;
  }
  const app = require('./api/api'); // eslint-disable-line global-require
  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    debug(`Peak API running on port ${port}`);
  });
}
