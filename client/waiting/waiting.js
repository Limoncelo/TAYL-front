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
            $('#codesniffer').html("Status test Codesniffer : " + res.codesnifferstatus);
            if(res.state == 2) {
                return res;
            } else {
                var timer = setInterval(function () {
                    Meteor.call('getJobStatus', Session.get('idJobList'), function (err, re) {
                        if (err) {
                            console.log('client waiting error: ', err);
                            $('.waitingCnt').find('.fa').removeClass('fa-spinner fa-pulse').addClass('fa-times');

                        } else {
                            $('#codesniffer').html("Status test Codesniffer : " + re.codesnifferstatus);

                            if (re.state == 2) {

                                clearInterval(timer);
                                Router.go('done');
                            } else if (re.state == 3) {
                                $('#phploc').html("Status : " + re.phplocstatus);
                                $('.infos').html('Erreur de traitement, veuillez réessayer.');
                                $('.link-back').css('display', 'block');
                                $('#phploc').css('display', 'none');
                                $('#codesniffer').css('display', 'none');
                                $('.waitingCnt').find('.fa').removeClass('fa-spinner fa-pulse').addClass('fa-times');

                                clearInterval(timer);

                            }
                        }
                    });
                }, 4000);

            }

            if(res.state == 3) {
                $('#phploc').html("Status : " + res.phplocstatus);
            }
            return res;
        }
    });
// }, 4000);

    //     //Interval to get data from api
    //      while(response.data.check == false {
    //           setInterval(getAPIData(1), 2000);
    //      }
}