const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersConstroller {
    async create(request, response){
        const { name, email, password } = request.body;
        const database = await sqliteConnection();

        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(checkUserExists){
            throw new AppError ("E-mail in use");
        }
        
        const hashedPassword = await hash(password, 8);

        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [ name, email, hashedPassword ]
        );

        return response.status(201).json();

    }
/**
    async update (request, response) {
        const { name, email } = request.body;
        const { id } = request.params; 

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        if(!user) {
            throw new AppError("Usuario Nao encontrado");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError("Este e-mail ja esta em uso.");
        }

        user.name = name;
        user.email = email;

        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        updated_at = ?
        WHERE id = ?`,
        [user.name, user.email, new Date(), id]
        );
    
        return response.status(200).json();
    }
*/
async update (request, response) {
    const { name, email, password, old_password } = request.body;
    const { id } = request.params; 

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if(!user) {
        throw new AppError("Usuario Nao encontrado");
    }

    const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
        throw new AppError("Este e-mail ja esta em uso.");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.name;

    if(password && !old_password){

        throw new AppError("Voce precisa informar a senha antiga");
    }

    if(password && old_password){
        const checkOldPassword = await compare (old_password, user.password);

        if(!checkOldPassword){
            throw new AppError("A senha antiga nao confere.");
        }

        user.password = await hash(password, 8);
    }

    await database.run(`
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
    [user.name, user.email, user.password, id]
    );

    return response.status(200).json();
    }
}


module.exports = UsersConstroller;