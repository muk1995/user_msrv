// Data Encryption and Decryption 
const encryptData = function (data, key, cb) {
    try {
        const Crypto = require('crypto');
        const encKey = Crypto.createHash('sha256').update(key + process.env.PASS_SALT_STATIC).digest();
        const plaintext = JSON.stringify(data);
        let iv = Crypto.randomBytes(16);

        let cipher = Crypto.createCipheriv('aes-256-cbc', encKey, iv);
        let encrypted = cipher.update(plaintext);
        let finalBuffer = Buffer.concat([encrypted, cipher.final()]);
        let encryptedData = iv.toString('hex') + finalBuffer.toString('hex');
        cb(null, encryptedData);
    } catch (e) {
        cb(e);
    }

}
exports.encryptData = encryptData;

const decryptData = function (encryptedData, key, cb) {
    try {
        const Crypto = require('crypto');
        const encKey = Crypto.createHash('sha256').update(key + process.env.PASS_SALT_STATIC).digest();

        let iv = new Buffer(encryptedData.substring(0, 32), 'hex');
        let encrypted = new Buffer(encryptedData.substring(32), 'hex');

        let decipher = Crypto.createDecipheriv('aes-256-cbc', encKey, iv);
        let decrypted = decipher.update(encrypted);
        let decryptedData = Buffer.concat([decrypted, decipher.final()]).toString();
        decryptedData = JSON.parse(decryptedData);
        cb(null, decryptedData);
    } catch (e) {
        cb(e);
    }
}
exports.decryptData = decryptData;

// Password Hashing and Comparing
const generatePassword = function (plaintext, cb) {
    const bcrypt = require('bcrypt');
    const crypto = require('crypto');
    const saltRounds =   10;              //parseInt(process.env.PASS_SALT_ROUNDS);
   // const staticSalt =   "19",                 // process.env.PASS_SALT_STATIC;
    const randomSalt = crypto.randomBytes(128).toString('hex');
    bcrypt.hash((plaintext ), saltRounds, function (err, hash) {
        if (err) {
            return cb(err);
        }
        return cb(null, {
            hash: hash,
            salt: randomSalt
        })
    })
}
exports.generatePassword = generatePassword;

const comparePassword = function (plaintextInput, hash, cb) {
    let bcrypt = require('bcrypt');
    const saltRounds = process.env.PASS_SALT_ROUNDS;
    const staticSalt = process.env.PASS_SALT_STATIC;
    bcrypt.compare((plaintextInput + staticSalt), hash, cb);
}
exports.comparePassword = comparePassword;


// Otp Hashing and Comparing
const secureOtp = function (plaintext, cb) {
    const bcrypt = require('bcrypt');
    const crypto = require('crypto');
    const saltRounds = parseInt(process.env.PASS_SALT_ROUNDS);
    const staticSalt = process.env.PASS_SALT_STATIC;
    const randomSalt = crypto.randomBytes(128).toString('hex');

    bcrypt.hash((plaintext + staticSalt), saltRounds, function (err, hash) {
        if (err) {
            return cb(err);
        }
        return cb(null, {
            hash: hash,
            salt: randomSalt
        })
    })
};
exports.secureOtp = secureOtp;

const compareOtp = function (plaintextInput, hash, cb) {
    let bcrypt = require('bcrypt');
    const saltRounds = process.env.PASS_SALT_ROUNDS;
    const staticSalt = process.env.PASS_SALT_STATIC;

    bcrypt.compare((plaintextInput + staticSalt), hash, cb);
};
exports.compareOtp = compareOtp;


// Input Validators
const validateEmail = function (email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
exports.validateEmail = validateEmail;

const isNumber = function (data) {
    let re = /^\d+$/;
    return re.test(data);
}
exports.isNumber = isNumber;

const validatePassword = function (password) {
    if (password.length < 8 || password.length > 50) {
        return false;
    } else {
        return true;
    }
}
exports.validatePassword = validatePassword;

const validatePhone = function (phone) {
    if (phone.length < 10 || phone.length > 13) {
        return false;
    } else {
        return true;
    }
}
exports.validatePhone = validatePhone;

const generate_account_id = function (cb) {
    const users = require("../models/users");
    users.get_used_account_ids({}, function (err, usedaccount_ids) {
        if (err) {
            console.log(err);
            return cb(new Error("error"))
        }
        if (usedaccount_ids.length !== 1) {
            return cb(null, Math.floor(Math.random() * (99999999 - 11111111) + 11111111));
        }
        let usedList = [];
        if (usedaccount_ids[0].csv_data) {
            usedList = usedaccount_ids[0].csv_data.split(',');
        }
        let x = true;
        let account_id = 0
        while (x) {
            account_id = Math.floor(Math.random() * (99999999 - 11111111) + 11111111)
            if (usedList.indexOf(account_id) < 0) {
                x = false;
            }
        }
        return cb(null, account_id);
    })
}
exports.generate_account_id = generate_account_id;

const clean_object = function (obj) {
    let new_obj = {}
    for (let i in obj) {
        if (obj[i] != null && obj[i] != undefined && obj[i] != "Invalid date") {
            new_obj[i] = obj[i];
        }
    }
    return new_obj;
}
exports.clean_object = clean_object;