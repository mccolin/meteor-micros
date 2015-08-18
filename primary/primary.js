
if (Meteor.isServer) {

  var servicesMap = {};
  var serviceCall = function(serviceName, methodName, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    check(serviceName, String);
    check(methodName, String);
    console.log("Primary will make a call to Service:", serviceName, "Method:", methodName);
    var service = servicesMap[serviceName];
    if ( service ) {
      console.log(" -> Will make call. Service", serviceName, "is defined.");
      console.log(" -> Arguments to call:", [].slice.call(arguments, 2));
      return service.call(methodName, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8);
    } else
      console.log(" -> Cannot make call. Service", serviceName, "not registered with primary");
  };

  var primary = Cluster.discoverConnection('primary');
  Meteor.setTimeout( function() {
    var primaryPing = primary.call('ping');
    console.log("Called primary.ping from primary: ", primaryPing);
  }, 1500);

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
