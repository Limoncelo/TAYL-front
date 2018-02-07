Template.home.rendered = function() {
    $('#options').on('show.bs.collapse', function () {
        $('.fa').removeClass('fa-caret-right');
        $('.fa').addClass('fa-caret-down');
    });
    $('#options').on('hide.bs.collapse', function() {
        $('.fa').removeClass('fa-caret-down');
        $('.fa').addClass('fa-caret-right');
    });


    Meteor.call('getGitHub', function (err, res) {
        // The method call sets the Session variable to the callback value
        if (err) {
            console.log('client github error: ', err);
        } else {
            console.log(res);
        }
    });
};

Template.main.events({
    'submit .gitSubmit'(event) {
        var tests = new Array();
        event.preventDefault();
        $('#options input').each(function (index, value) {
            if(value.checked) {
                tests[value.name] = 1;
            } else {
                tests[value.name] = 0;
            }
        });

        var regEx = new RegExp(/(https|http):\/\/github.com\/(.*)\/(.*).git(\/?)/);
        var regExMail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

        if(regEx.test(event.target.urlGit.value) && regExMail.test(event.target.mail.value)) {
            var urlGit = event.target.urlGit.value;
            var mailUser = event.target.mail.value;

            //appel de la méthode
            Meteor.call('postAPIData', urlGit, mailUser, tests, function (err, res) {
                // The method call sets the Session variable to the callback value
                if (err) {
                    console.log('git submit error: ' , err);

                } else {
                    Session.set({
                        'urlGit' : event.target.urlGit.value,
                        'mail' : event.target.mail.value,
                        'idJobList' : res.idJobList
                    });
                    console.log('git submit success: ' , res);

                    //redirection
                    Router.go('waiting');
                    return res;
                }
            });
        } else {
            $('#warning').html("<p>Attention veuillez vérifier votre lien git et votre email.</p>");
        }

        Template.home.helpers({
            //récupérer en variable de session les données entrées par l'utilisateur
            urlGit: function () {
                return Session.get('urlGit');
            },
            mail: function () {
                return Session.get('mail');
            }
        });

        Template.done.helpers({
            //récupérer variable de session créée par le retour de l'api
            urlGit: function () {
                return Session.get('urlGit');
            },
            mail: function () {
                return Session.get('mail');
            }
        });
    }
});