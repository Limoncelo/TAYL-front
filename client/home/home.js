
Template.main.events({
    'submit .gitSubmit'(event) {
        event.preventDefault();

        Template.home.helpers({
            //récupérer variable de session créée par le retour de l'api
            location: function () {
                return Session.get('location');
            }
        });
        // https://github.com/Limoncelo/TAYL-front.git

        var regEx = new RegExp(/(https|http):\/\/github.com\/(.*)\/(.*).git(\/?)/);

        if(regEx.test(event.target.gitURL.value)) {
            var gitURL = event.target.gitURL.value;
            Meteor.call('getAPIData', gitURL, function (err, res) {
                // The method call sets the Session variable to the callback value
                if (err) {
                    Session.set('location', {error: err});

                } else {
                    Session.set('location', res);
                    console.log(res);
                    return res;
                }
            });

            Router.go('waiting');
        } else {

        }

    }

});