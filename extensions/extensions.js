
if (Meteor.isServer) {

  // Connect back to the primary:
  var primary = Cluster.discoverConnection('primary');

  Meteor.setTimeout( function() {
    primary.call("register", "ping", process.env.CLUSTER_SERVICE);
    primary.call("register", "echo", process.env.CLUSTER_SERVICE);
  }, 1000);

  // Meteor.setInterval( function() {
  //   var pingDate = primary.call("ping");
  //   console.log("Pinging Primary:", pingDate);
  // }, 15000);

  Meteor.methods({
    "ping": function() {
      console.log("Extensions: Receiving Ping Request");
      return new Date();
    },
    "echo": function(message) {
      console.log("Extensions: Receiving Echo Request");
      return message;
    }
  });

}
