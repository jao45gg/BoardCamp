import db from "../database/database.connection.js";
import dayjs from "dayjs";

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

        const customers = await db.query(`SELECT * FROM customers;`);
        const customersFormated = customers.rows.map(c => (
            {
                ...c,
                birthday: dayjs(c.birthday).format("YYYY-MM-DD")
            }
        ))
        res.send(customersFormated);

    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function getCustomersById(req, res) {

    const { id } = req.params;

    try {

        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        if (customer.rows.length <= 0) return res.sendStatus(404);

        const customersFormated = {
            ...customer.rows[0],
            birthday: dayjs(customer.rows[0].birthday).format("YYYY-MM-DD")
        }
        res.send(customersFormated);

    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function updateCustomer(req, res) {

    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    try {

        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        const customer1 = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);
        if (customer.rows.length <= 0) return res.sendStatus(404);

        if (customer.rows[0].cpf === cpf || customer1.rows[0]?.id == null || customer1.rows[0]?.id === customer.rows[0].id) {
            await db.query(`UPDATE customers
            SET "name" = $1, "phone" = $2, cpf = $3, birthday = $4
            WHERE id = $5;`, [name, phone, cpf, birthday, id]);
        } else {
            return res.sendStatus(409);
        }

        res.send();

    } catch (err) {
        res.status(500).send(err.message);
    }

}