Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'waiting'
 });

Router.route('/', {
    name : 'home',
});

Router.route('/waiting', {
    name: 'waiting',
});

Router.route('/waiting2', {
    name: 'waiting2',
    where: 'server',
}).get(function() {
    this.response.writeHead(302, {
        'Location': "http://127.0.0.1:8000/queues/startTestProcess?urlGit=" + this.request.body.url
    });
    this.response.end();
});

Router.route('/done', {
    name: 'done',
})

Router.route('/test', {
    name : 'telize'
})