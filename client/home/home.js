Template.home.rendered = function() {
    $('#options').on('show.bs.collapse', function () {
        $('.fa').removeClass('fa-caret-right');
        $('.fa').addClass('fa-caret-down');
    });
    $('#options').on('hide.bs.collapse', function() {
        $('.fa').removeClass('fa-caret-down');
        $('.fa').addClass('fa-caret-right');
    });

};
//gestion des événements sur le site (template main)
Template.main.events({
    //submit du formulaire en page d'accueil
    'submit .gitSubmit'(event) {
        //désactiver le bouton
        $("#submitBtn").prop("disabled",true);
        var tests = new Array();
        //empêcher l'événements par défaut du navigateur de se déclencher
        event.preventDefault();
        //choisir les tests à réaliser sur le projet git soumis
        $('#options input').each(function (index, value) {
            if(value.checked) {
                tests[value.name] = 1;
            } else {
                tests[value.name] = 0;
            }
        });
        //vérifications sur l'url du git et le mail (également réalisées côté serveur)
        var regEx = new RegExp(/(https|http):\/\/github.com\/(.*)\/(.*).git(\/?)/);
        var regExMail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if(regEx.test(event.target.urlGit.value) && regExMail.test(event.target.mail.value)) {
            var urlGit = event.target.urlGit.value;
            var mailUser = event.target.mail.value;
            $('#submitBtn').prop("disabled",true);
            $('#submitBtn').html('<i class="fa fa-spinner fa-pulse no-margin"></i>&nbsp;Lancement de l\'analyse');
            //appel de la méthode d'appel de l'API avec envoie de données
            Meteor.call('postAPIData', urlGit, mailUser, tests, function (err, res) {
                // The method call sets the Session variable to the callback value
                if (err) {
                    console.log('git submit error: ' , err);

                } else {
                    //récupérer en variable de session les données soumises par l'utilisateur et l'id renvoyé par l'api
                    Session.set({
                        'urlGit' : event.target.urlGit.value,
                        'mail' : event.target.mail.value,
                        'idJobList' : res.idJobList
                    });

                    //redirection
                    Router.go('waiting');
                    return res;
                }
            });
        } else {
            $('#warning').html("<p>Attention veuillez vérifier votre lien git et votre email.</p>");
        }

        Template.home.helpers({
            //récupérer les données entrées par l'utilisateur pour préremplir les champs si l'utilisateur revient sur l'accueil (template home)
            urlGit: function () {
                return Session.get('urlGit');
            },
            mail: function () {
                return Session.get('mail');
            }
        });

        Template.done.helpers({
            //récupérer les données entrées par l'utilisateur pour les afficher sur la page des résultats (template done) 
            urlGit: function () {
                return Session.get('urlGit');
            },
            mail: function () {
                return Session.get('mail');
            }
        });
    }
});
