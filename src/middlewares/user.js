function userAuth(req, res, next) {
 
    const token = "27a.9f3.s87";
    const pass = "27a.9f3.s87";
    const auth = token === pass;
 
    if (!auth) {
        return res.status(401).json({
            message: "Unauthorized Access"
        })
    }
 
    else next();
}

module.exports = {userAuth}