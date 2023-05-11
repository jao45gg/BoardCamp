import db from "../database/database.connection.js";

export async function postCostumer(req, res) {

    try {

        const { name, phone, cpf, birthday } = req.body;

        const customer = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);
        if (customer.rows.length > 0) return res.sendStatus(409);

        await db.query(`INSERT INTO customers ("name", "phone", "cpf", "birthday") VALUES 
        ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);
        res.sendStatus(201);


    } catch (err) {
        res.status(500).send(err.message);
    }

}