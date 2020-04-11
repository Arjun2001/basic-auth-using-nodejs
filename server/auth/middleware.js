const jwt = require('jsonwebtoken');

function checkTokenSetUser(req, res, next) {
    const authHeader = req.get('authorization');
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        if(token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
                if(err){
                    console.log(err);
                }
                req.user=user;
                next();
            });
        }else {
            next();
        }
    }else {
        next();
    }
};

function unAuthorized(res, next) {
    const error = new Error('unauthorized');
    res.status(401);
    next(error);
}

function isLoggedIn(req, res, next) {
    if(req.user){
        next();
    } else {
        unAuthorized(res, next);
    }
};

function isAdmin(req, res, next) {
    if(req.user.role == 'admin') {
        next();
    }else {
        unAuthorized(res, next);
    }
}


module.exports = {
    checkTokenSetUser,
    isLoggedIn,
    isAdmin
};