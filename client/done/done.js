var phrases = [
    ' % de votre code est irréprochable',
    ' % of your code is legen... wait for it... dary !',
    ' % de votre code ne vient pas de la table d\'en face',
    ' % de votre code n\'est pas piqué des hannetons',
    ' % de votre code a la lumière à tous les étages',
    ' % de votre code est puissant'
];

var iTab = Math.floor(Math.random() * (phrases.length));

Template.done.onRendered(function () {
    var regEx = new RegExp(/(https|http):\/\/github.com\/(.*)\/(.*).git(\/?)/);
    var projectName = regEx.exec(Session.get('urlGit'))[3];
    var idJobList = 15;
    //
    // $('.show').click(function () {
    //     $('.cSErrors').css('display', 'block');
    // })
    console.log(idJobList);
    Meteor.call('getJsonFile', projectName, idJobList, function (err, res) {
        // The method call sets the Session variable to the callback value
        if (err) {
            console.log('client done error: ', err);
        } else {
            res = res.json;
            var count = 1;

            // results phploc
            // $.each(res.phpLoc, function( index, element ) {
            //     $('#phpLoc').append('<li class="list-group-item">' + index + ' : ' + element + '</li>' );
            // });

            // results codesniff global
            var clN = '';
            $.each(res.codeSniff.totals, function (index, element) {
                clN = '';
                if(index == 'errors') {
                    clN = 'red';
                } else if (index == 'warnings') {
                    clN = 'orange';
                } else if (index == 'fixable') {
                    clN = 'blue';
                }
                $('#codeSniffer').append('<li class="list-group-item"><span class="' + clN + '">' + index + ' : ' + element + '</span></li>');
            });

            // results codesniff detail
            $.each(res.codeSniff.files, function (index, element) {
                $('.cSErrors').append('<ul class="list-group listCSErrors"></ul>');
                $('.cSErrors').last().append('<div class="card">' +
                    '<a id="accordion' + count + '" class="" data-toggle="collapse" href="#collapse' + count + '" role="button"  href="#collapse' + count + '" aria-expanded="false" aria-controls="collapse' + count + '">' +
                    '<div class="card-header" id="heading' + count + '">' +
                    '                                    In file' +
                    '<span class="filePath">' + index + '</span>' +
                    '<br><span class="red">Errors : </span> ' + element.errors + ' // <span class="orange">Warnings</span> : ' + element.warnings +
                    '<br><i class="fa fa-caret-right"></i>&nbsp;Messages ' +
                    '</div></a></div>');
                $('.cSErrors').last().append('<div id="collapse' + count + '" class="collapse" aria-labelledby="heading' + count + '" data-parent="#accordion"> </div>');
                $('#collapse' + count).last().append('<ul class="list-group" id="list' + count + '"></ul>');
                $.each(element.messages, function (i, e) {
                    clN = '';
                    if(e.type == 'ERROR') {
                        clN = 'red';
                    } else if (e.type == 'WARNING') {
                        clN = 'orange';
                    } else if (e.type == 'fixable') {
                        clN = 'blue';
                    }
                    $('#list' + count).last().append('<li class="list-group-item">Type :<span class="' + clN + '"> ' + e.type + '</span> // Message : ' + e.message + ' // At line : ' + e.line + ' </li>');
                });

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

            //CALCUL ERREURS
            var fixable = res.codeSniff.totals.warnings + res.codeSniff.totals.fixable;
            var errors = res.codeSniff.totals.errors;

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

                    value: Math.round(percent, 1) + phrases[iTab],
                    className: 'progressbarLabel',
                    style: {
                        color: '#fffaea',
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        padding: 0,
                        margin: 0,
                        transform: {
                            prefix: true,
                            value: 'translate(-60%, -50%)'
                        }
                    },
                    autoStyleContainer: true,
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