function adminAuth(req, res, next) {
 
    const token = "32d.3k2.k36";
    const pass = "32d.3k2.k36";
    const auth = token === pass;
 
    if (!auth) {
        return res.status(401).json({
            message: "Unauthorized Access"
        })
    }
 
    else next();
}

module.exports = {adminAuth}