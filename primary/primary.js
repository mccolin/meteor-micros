
if (Meteor.isServer) {

  var servicesMap = {};
  var serviceCall = function(serviceName, methodName /* arg1, arg2, ... */) {
    // if (! _.isString(serviceName) ) return;
    // if (! _.isString(methodName) ) return;
    check(serviceName, String);
    check(methodName, String);
    console.log("Primary will make a call to Service:", serviceName, "Method:", methodName);
    var service = servicesMap[serviceName];
    if ( service ) {
      console.log(" -> Will make call. Service", serviceName, "is defined.");
      console.log(" -> Arguments to call:", [].slice.call(arguments, 2));
      service.call(this, [].slice.call(arguments, 1));
    } else
      console.log(" -> Cannot make call. Service", serviceName, "not registered with primary");
  };

  // var extensions = Cluster.discoverConnection('extensions');

  Meteor.setInterval( function() {
    var pingDate = serviceCall('ping', 'ping'); // extensions.call("ping");
    if (pingDate) console.log("Pinging Ext:", pingDate);

    var echoMsg = serviceCall('echo', 'echo', 'I Love You'); // extensions.call("echo", "I Love You");
    if (echoMsg) console.log("Echoing Ext:", echoMsg);
  }, 5000);

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

}
