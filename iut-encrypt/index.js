'use strict';
const Crypto = require('crypto');

exports.sha1 = (password) => {
    return Crypto.createHash('sha1').update(password).digest('hex');
};

exports.compareSha1 = (password, hash) => {
    return exports.sha1(password) === hash;
};