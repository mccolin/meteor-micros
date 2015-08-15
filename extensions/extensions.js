
if (Meteor.isServer) {

  var primary = Cluster.discoverConnection('primary');

  Meteor.setInterval( function() {
    var pingDate = primary.call("ping");
    console.log("Pinging Primary:", pingDate);
  }, 4000);

  Meteor.methods({
    "ping": function() {
      console.log("Extensions: Receiving Ping Request");
      return new Date();
    },
    "echo": function(message) {
      console.log("Extensions: Receiving Echo Request");
      return "Echo: "+message;
    }
  });

}
