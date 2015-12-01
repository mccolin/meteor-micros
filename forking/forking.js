
if (Meteor.isServer) {

  // Node Cluster: Process management, forking
  var cluster = Meteor.npmRequire('cluster');

  var servicesMap = {};

  Meteor.methods({
    "ping": function() {
      console.log("Primary: Receiving Ping");
      return new Date();
    },
    "register": function(serviceName, clusterConn) {
      console.log("Subservice Registered:", serviceName, "at", clusterConn);
      servicesMap[serviceName] = Cluster.discoverConnection(clusterConn);
      console.log("Services Map now has", _.keys(servicesMap));
    }
  });

  Meteor.startup(function () {

    if (cluster.isMaster) {
      console.log("Arbiter has started. PID:", process.pid, "Port:", process.env.PORT);

      var numCPUs = Meteor.npmRequire('os').cpus().length;
      var numWorkers = 2 || numCPUs;

      for (var i = 1; i <= numWorkers; i++) {
        var childPort = parseInt(process.env.PORT) + i;
        console.log("Forking worker with child port", childPort, "...");
        cluster.fork({'PORT': childPort});
      }

      cluster.on('online', function(worker) {
        console.log("Worker", worker.process.pid, "has come online.");
      });

      cluster.on('exit', function(worker, code, signal) {
        console.log("Worker", worker.process.pid, "has died.");
      });

    } else {
      console.log("Worker has started. PID:", process.pid, "Port:", process.env.PORT);
    }


  });

}

