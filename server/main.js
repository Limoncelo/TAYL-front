import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

    Meteor.methods({
        'getAPIData': function (url, mailUser, tests) {
            // avoid blocking other method calls from the same client
            this.unblock();
            var urlGit = url;
            var mailUser = mailUser;

            var regEx = new RegExp(/(https|http):\/\/github.com\/(.*)\/(.*).git(\/?)/);
            var regExMail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

            if(regEx.test(urlGit) && regExMail.test(mailUser)) {
                var params = '';
                for(var index in tests) {
                    params += '&' + index + '=' + tests[index];
                }
                // API URL + git url from input
                var apiUrl = 'http://127.0.0.1:8000/queues/startTestProcess?urlGit=' + urlGit + '&mailUser=' + mailUser + params;
                // asynchronous call to the dedicated API calling function
                var id = Meteor.wrapAsync(apiCall)(apiUrl);

                return id;
            }
        },
        'getJobStatus' : function (id) {
            this.unblock();
            var idJobList = id;

            var apiUrl = 'http://127.0.0.1:8000/getStatus?idJobList=' + idJobList;
            // var apiUrl = 'http://192.168.1.200:61800/getStatus?idJobList=' + idJobList;
            var response = Meteor.wrapAsync(apiCall)(apiUrl);

            return response;
        },
        'getJsonFile' : function () {
            this.unblock();

            var apiUrl = 'http://127.0.0.1:8000/getJson';
            var response = Meteor.wrapAsync(apiCall)(apiUrl);

            return response;
        },
        'getDonation' : function () {
            this.unblock();

            var apiUrl = 'http://127.0.0.1:8000/donationBitCoin';
            var response = Meteor.wrapAsync(apiCall)(apiUrl);

            return response;
        },
        'getGitHub' : function () {
            this.unblock();

            var apiUrl = 'https://github.com/login/oauth/authorize?scope=user:email&client_id=90b9db7e94aa419b9073';
            var response = Meteor.wrapAsync(apiCall)(apiUrl);

            return response;
        },
        'getEther' : function () {
            this.unblock();

            var apiUrl = 'http://127.0.0.1:8000/donationEther';
            var response = Meteor.wrapAsync(apiCall)(apiUrl);

            return response;
        }
    });

    var apiCall = function (apiUrl, callback) {
        // try…catch allows you to handle errors
        try {
            // A successful API call returns no error but the contents from the JSON response
            var response = HTTP.get(apiUrl).data;
            callback(null, response);

        } catch (error) {
            // If the API responded with an error message and a payload
            if (error.response) {
                var errorCode = error.response.data;
                var errorMessage = error.response.data;
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
