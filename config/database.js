const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports={
    uri:"mongodb://eclair:Divinmaitre5@ds147964.mlab.com:47964/eclairdb",
    secrete: crypto,
    db: 'eclairdb'
}