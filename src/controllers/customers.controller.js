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

export async function getCustomers(req, res) {

    try {

        const games = await db.query(`SELECT * FROM customers;`);
        res.send(games.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function getCustomersById(req, res) {

    const { id } = req.params;

    try {

        const games = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        if(games.rows.length <= 0) return res.sendStatus(404);
        res.send(games.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }

}