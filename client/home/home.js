
Template.main.events({
    'submit .gitSubmit'(event) {
        event.preventDefault();

        //Router.go('waiting',{
        //}, {
          //  query: "url=" + event.target.gitURL.value,
        //});
        Template.home.helpers({
            location: function () {
                return Session.get('location');
            }
        });
                var gitURL = event.target.gitURL.value;
                Meteor.call('getAPIData', gitURL, function (err, res) {
                    // The method call sets the Session variable to the callback value
                    if (err) {
                        Session.set('location', {error: err});

                    } else {
                        Session.set('location', res);
                        return res;
                    }
                });

    }

});