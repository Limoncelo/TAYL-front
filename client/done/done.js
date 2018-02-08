Template.done.onRendered(function () {
    var regEx = new RegExp(/(https|http):\/\/github.com\/(.*)\/(.*).git(\/?)/);
    var projectName = regEx.exec(Session.get('urlGit'))[3];
    Meteor.call('getJsonFile', projectName, function (err, res) {
        // The method call sets the Session variable to the callback value
        if (err) {
            console.log('client done error: ', err);
            console.log('response', res);
        } else {
            console.log('in else');
            res = res.json;
            var count = 1;
            console.log(res);

            // results phploc
            // $.each(res.phpLoc, function( index, element ) {
            //     $('#phpLoc').append('<li class="list-group-item">' + index + ' : ' + element + '</li>' );
            // });

            // results codesniff global
            $.each(res.codeSniff.totals, function (index, element) {
                $('#codeSniffer').append('<li class="list-group-item">' + index + ' : ' + element + '</li>');
            });

            // results codesniff detail
            $.each(res.codeSniff.files, function (index, element) {
                $('.cSErrors').append('<ul class="list-group listCSErrors"></ul>');
                $('.cSErrors').last().append('<div class="card">' +
                    '<a id="accordion' + count + '" class="" data-toggle="collapse" href="#collapse' + count + '" role="button"  href="#collapse' + count + '" aria-expanded="false" aria-controls="collapse' + count + '">' +
                    '<div class="card-header" id="heading' + count + '">' +
                    '                                    In file' +
                    '<span class="filePath">' + index + '</span>' +
                    '<br>Errors : ' + element.errors + ' // Warnings : ' + element.warnings +
                    '<br><i class="fa fa-caret-right"></i>&nbsp;Messages ' +
                    '</div></a></div>');
                $('.cSErrors').last().append('<div id="collapse' + count + '" class="collapse" aria-labelledby="heading' + count + '" data-parent="#accordion"> </div>');
                $('#collapse' + count).last().append('<ul class="list-group" id="list' + count + '"></ul>');
                $.each(element.messages, function (i, e) {
                    $('#list' + count).last().append('<li class="list-group-item">Type : ' + e.type + ' // Message : ' + e.message + ' // At line : ' + e.line + ' </li>');
                });

                // console.log(index);
                // $.each(index, function (index, element) {
                //     $('.list-group').last().append('<li class="list-group-item">' + element + '</li>');
                // });

                count++;


                $('#accordion').on('show.bs.collapse', function (e) {
                    var clicked = $(document).find("[href='#" + $(e.target).attr('id') + "']");

                    $(clicked).find('.fa').removeClass('fa-caret-right');
                    $(clicked).find('.fa').addClass('fa-caret-down');

                });
                $('#accordion').on('hide.bs.collapse', function (e) {
                    var clicked = $(document).find("[href='#" + $(e.target).attr('id') + "']");
                    $(clicked).find('.fa').removeClass('fa-caret-down');
                    $(clicked).find('.fa').addClass('fa-caret-right');
                });
            });

            console.log('before total');
            //CALCUL ERREURS
            var fixable = res.codeSniff.totals.warnings + res.codeSniff.totals.fixable;
            var errors = res.codeSniff.totals.errors;
            console.log('fix:'+fixable+'errors'+errors);

            var percent = (fixable * 100) / errors;

            // var percent = 1;
            //JAUGE REUSSITE
            var ProgressBar = require('progressbar.js');

            var svgPath = document.getElementById('progress');
            var path = new ProgressBar.SemiCircle(svgPath, {
                duration: 300,
                color: '#8F9EA3',
                easing: 'easeInOut',
                text: {
                    // Initial value for text.
                    // Default: null
                    value: Math.round(percent, 1) + ' % de votre code est bon',

                    // Class name for text element.
                    // Default: 'progressbar-text'
                    className: 'progressbarLabel',

                    // Inline CSS styles for the text element.
                    // If you want to modify all CSS your self, set null to disable
                    // all default styles.
                    // If the style option contains values, container is automatically
                    // set to position: relative. You can disable behavior this with
                    // autoStyleContainer: false
                    // If you specify anything in this object, none of the default styles
                    // apply
                    // Default: object speficied below
                    style: {
                        // Text color.
                        // Default: same as stroke color (options.color)
                        color: '#fffaea',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        padding: 0,
                        margin: 0,
                        // You can specify styles which will be browser prefixed
                        transform: {
                            prefix: true,
                            value: 'translate(-60%, -50%)'
                        }
                    },

                    // Only effective if the text.style is not null
                    // By default position: relative is applied to container if text
                    // is set. Setting this to false disables that feature.
                    autoStyleContainer: true,

                    // Only effective if the shape is SemiCircle.
                    // If true, baseline for text is aligned with bottom of
                    // the SVG canvas. If false, bottom line of SVG canvas
                    // is in the center of text.
                    // Default: true
                    alignToBottom: true
                },
            });
            path.animate(percent / 100, {
                duration: 800
            }, function () {
                //callback
            });
            return res;


        }

    });


});