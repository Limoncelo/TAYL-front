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
            $('#phploc').html("Status test Phploc : " + res.phplocstatus);
            $('#codesniffer').html("Status test Codesniffer : " + res.codesnifferstatus);
            if(res.state == 2) {
                return res; console.log('success', res);
            } else {
                var timer = setInterval(function () {
                    console.log(Session.get('idJobList'));
                    Meteor.call('getJobStatus', Session.get('idJobList'), function (err, re) {
                        if (err) {
                            console.log('client waiting error: ', err);
                            $('.waitingCnt').find('.fa').removeClass('fa-spinner fa-pulse').addClass('fa-times');

                        } else {
                            console.log('tentative', re);
                            $('#phploc').html("Status test Phploc : " + re.phplocstatus);
                            $('#codesniffer').html("Status test Codesniffer : " + re.codesnifferstatus);

                            if (re.state == 2) {
                                console.log('success processus');

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

                                console.log('erreur processus');
                            }
                        }
                    });
                }, 4000);

            }

            if(res.state == 3) {
                $('#phploc').html("Status : " + res.phplocstatus);
            }
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