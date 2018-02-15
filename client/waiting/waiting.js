Template.waiting.rendered = function() {
    //appel de la méthode getJobStatus pour savoir quand l'api a fini de faire ses tests et peut renvoyer un résultat
        Meteor.call('getJobStatus', Session.get('idJobList'), function (err, res) {
        
        if (err) {
            console.log('client waiting error: ' , err);
        } else {
            //mise à jour de l'affichage du status des tests en cours
            $('#codesniffer').html("Status test Codesniffer : " + res.codesnifferstatus);
            //si les tests sont terminés, redirection vers la page des résultats
            if(res.state == 2) {
                Router.go('done');
                return res;
            } else {
                //rappel de la méthode jusqu'à ce que l'api renvoie que les tests sont terminés
                var timer = setInterval(function () {
                    Meteor.call('getJobStatus', Session.get('idJobList'), function (err, re) {
                        if (err) {
                            //si l'api renvoie une erreur, mise à jour de l'affichage avec un lien vers la page d'accueil et fin de l'appel de la méthode
                            console.log('client waiting error: ', err);
                            
                                $('#phploc').html("Status : " + re.phplocstatus);
                                $('.infos').html('Erreur de traitement, veuillez réessayer.');
                                $('.link-back').css('display', 'block');
                                $('#phploc').css('display', 'none');
                                $('#codesniffer').css('display', 'none');
                                $('.waitingCnt').find('.fa').removeClass('fa-spinner fa-pulse').addClass('fa-times');
                                clearInterval(timer);

                        } else {
                            $('#codesniffer').html("Status test Codesniffer : " + re.codesnifferstatus);
                            if (re.state == 2) {
                            //si l'api retourne que les tests sont finis avec succes, redirection vers la page des résultats et fin de l'appel de la méthode
                                clearInterval(timer);
                                Router.go('done');
                            } else if (re.state == 3) {
                                //si l'api retourne que les tests ont échoué, mise à jour de l'affichage avec lien vers la page d'accueil et fin de l'appel de la méthode
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
                //si l'api retourne que les tests ont échoué, mise à jour de l'affichage avec lien vers la page d'accueil et fin de l'appel de la méthode
                $('#phploc').html("Status : " + res.phplocstatus);
            }
            return res;
        }
    });

}
