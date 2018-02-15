//configuration du router avec main comme template principal (commun à toutes les pages)
Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'waiting'
 });
//home est la page d'accueil 
Router.route('/', {
    name : 'home',
});
//waiting est la page d'attente des résultats
Router.route('/waiting', {
    name: 'waiting',
});
//done est la page d'affichage des résultats reçus
Router.route('/done', {
    name: 'done',
})
