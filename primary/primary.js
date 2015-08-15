
if (Meteor.isServer) {

  var extensions = Cluster.discoverConnection('extensions');

  Meteor.setInterval( function() {
    var pingDate = extensions.call("ping");
    var echoMsg = extensions.call("echo", "I Love You");

    console.log("Pinging Ext:", pingDate);
    console.log("Echoing Ext:", echoMsg);
  }, 5000);

  Meteor.methods({
    "ping": function() {
      console.log("Primary: Receiving Ping");
      return new Date();
    },
  });

}
