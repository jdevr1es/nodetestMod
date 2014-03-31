/*
 * GET companylist page.
 */

exports.companylist = function (db) {
    return function (req, res) {
        db.collection('companylist').find().toArray(function (err, items) {
            res.json(items);
        })
    }
};

/*
 * POST to addcompany.
 */

exports.addcompany = function (db) {
    return function (req, res) {
        db.collection('companylist').insert(req.body, function (err, result) {
            res.send(
              (err === null) ? { msg: '' } : { msg: err }
            );
        });
    }
};

/*
 * DELETE to deletecompany.
 */

exports.deletecompany = function (db) {
    return function (req, res) {
        var companyToDelete = req.params.id;
        db.collection('companylist').removeById(companyToDelete, function (err, result) {
            res.send((result === 1) ? { msg: '' } : { msg: 'error: ' + err });
        });
    }
};
