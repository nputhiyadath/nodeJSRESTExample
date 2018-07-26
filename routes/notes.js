const express = require('express');
const router = express.Router();
const db = require('../config/db'); //added to .gitignore
/**
 * config/db.js file structure
 *
 * module.exports = {
    URL: '<YOUR_MONGODB_URL_HERE>',
    NAME: '<DATABASE_NAME>'
}
 */

const mongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

router.post('/', (req, res) => {
    mongoClient.connect(db.URL, {useNewUrlParser: true}, (error, database) => {
        if (error) {
            throw error;
        }
        database.db(db.NAME).collection('notes').insert(req.body).then(value => {
            res.send(`Created new entry with ID ${value.insertedIds[0]} and value ${value.ops[0].title}`);
        });
        database.close();
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const details = {'_id': new ObjectID(id)};
    mongoClient.connect(db.URL, {useNewUrlParser: true}, (error, database) => {
        if (error) {
            throw error;
        }
        database.db(db.NAME).collection('notes').findOne(
            details, (err, item) => {
                if (err) {
                    return err;
                } else {
                    res.send(item);
                }
            }
        );
        database.close();
    });

});

router.get('/', (req, res) => {
    mongoClient.connect(db.URL, {useNewUrlParser: true}, (error, database) => {
        if (error) {
            throw error;
        }
        database.db(db.NAME).collection('notes').find().toArray((err, results) => {
            res.send(results);
        });
        database.close();
    });
});

module.exports = router;