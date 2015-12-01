
if (Meteor.isServer) {

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
    console.log("Arbiter has started.")
  });

}

