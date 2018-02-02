Template.waiting.rendered = function() {
    // setTimeout(function(){

    // while(Session.get('idJobList') == undefined) {
    //     continue;
    // }
        Meteor.call('getJobStatus', Session.get('idJobList'), function (err, res) {
        // The method call sets the Session variable to the callback value
        if (err) {
            console.log('client waiting error: ' , err);
        } else {
            Session.set('check', true);

            do {
                Meteor.call('getJobStatus', Session.get('idJobList'), function (err, res) {
                    if(err) {
                        console.log('client waiting error: ' , err);
                    } else {
                        $('#phploc').html("Status test Phploc : " + res.phplocstatus);
                        $('#codesniffer').html("Status test Codesniffer : " + res.codesnifferstatus);
                        Session.set('check', res.check);
                    }
                })
            } while(Session.get('check') == false);
            console.log('success waiting: ' , res);
            return res;
        }
    });
// }, 4000);

    //     //Interval to get data from api
    //      while(response.data.check == false {
    //           setInterval(getAPIData(1), 2000);
    //      }
}