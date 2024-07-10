const { Router } = require("express");

const UsersConstroller = require("../controllers/UsersConstroller");

const usersRoutes = Router();


function MyMiddleware(request, response, next){
    console.log("Vc passou pelo");

    if(!request.body.isAdmin){
        return response.json({ message: "user unauthorized"});
    }

next();
}

const usersConstroller = new UsersConstroller();


usersRoutes.post("/", MyMiddleware, usersConstroller.create);
usersRoutes.put("/:id", usersConstroller.update);

module.exports = usersRoutes;