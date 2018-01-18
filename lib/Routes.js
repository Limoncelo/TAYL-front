Router.configure({
    layoutTemplate: 'main',
});

Router.route('/', {
    name : 'home',
});

Router.route('/waiting', {
    name: 'waiting',
})

Router.route('/done', {
    name: 'done',
})