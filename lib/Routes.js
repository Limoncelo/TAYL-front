Router.configure({
    layoutTemplate: 'main',
});

Router.route('/', {
    name : 'accueil',
});

Router.route('/waiting', {
    name: 'waiting',
})

Router.route('/done', {
    name: 'done',
})