import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

    Meteor.methods({
        'getAPIData': function (url) {
            // avoid blocking other method calls from the same client
            this.unblock();
            var apiUrl = 'http://127.0.0.1:8000/queues/startTestProcess?urlGit=' + url;
            // asynchronous call to the dedicated API calling function
            var response = Meteor.wrapAsync(apiCall)(apiUrl);
            return response;
        }
    });




    var apiCall = function (apiUrl, callback) {
        // try…catch allows you to handle errors
        try {
            var response = HTTP.get(apiUrl).data;
            // A successful API call returns no error
            // but the contents from the JSON response
            callback(null, response);

        } catch (error) {
            // If the API responded with an error message and a payload
            if (error.response) {
                var errorCode = error.response.data.code;
                var errorMessage = error.response.data.message;
                // Otherwise use a generic error message
            } else {
                var errorCode = 500;
                var errorMessage = 'Cannot access the API';
            }
            // Create an Error object and return it via callback
            var myError = new Meteor.Error(errorCode, errorMessage);
            callback(myError, null);
        }
    }
});
