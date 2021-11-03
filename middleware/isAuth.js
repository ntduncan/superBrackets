// This is how it was done in the shop project
// module.exports = (req, res, next) => {
//     if (!req.session.isLoggedIn) {
//         return res.redirect('/login');
//     }
//     next();
// }