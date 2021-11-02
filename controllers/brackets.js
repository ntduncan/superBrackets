const Bracket = require("../models/bracket");

exports.getBracket = (req, res, next) => {
   const bracketId = req.params.bracketId;
   Bracket.findById(bracketId)
      .then((bracket) => {
         res.render("shop/bracket-detail", {
            bracket: bracket,
            pageTitle: bracket.title,
            path: "/brackets",
         });
      })
      .catch((err) => {
         const error = new Error(err);
         error.httpStatusCode = 500;
         return next(error);
      });
};
