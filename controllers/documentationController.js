class DocumentationController {
    renderDocumentation(req, res, next) {
        res.redirect('https://documenter.getpostman.com/view/23888060/2s93JusNAC')
    }


    renderBaseUrl(_, res, next) {
        res.render('index');
    }
}

module.exports = new DocumentationController();