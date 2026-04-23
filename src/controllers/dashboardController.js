exports.renderHome = (req, res) => {
    res.render('dashboard/home', {
        title: 'Nexo Studio | Tu Bio-Link Pro, Gratis para Siempre'
    });
};

exports.renderDashboard = (req, res) => {
    res.render('dashboard/index', {
        title: 'Nexo Studio | Editor'
    });
};
