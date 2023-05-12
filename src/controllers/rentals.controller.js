import db from "../database/database.connection.js";
import dayjs from "dayjs";

export async function postRentals(req, res) {

    try {

        const { customerId, gameId, daysRented } = req.body;

        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);
        if (customer.rows.length <= 0) return res.sendStatus(400);
        const game = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
        if (game.rows.length <= 0) return res.sendStatus(400);
        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId]);
        if (rentals.rows.length >= game.rows[0].stockTotal) return res.sendStatus(400);

        const rentDate = dayjs().format("YYYY-MM-DD");
        const originalPrice = Number(daysRented) * game.rows[0].pricePerDay;

        await db.query(`INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate",
        "originalPrice", "delayFee") VALUES 
        ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);
        res.sendStatus(201);


    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function getRentals(req, res) {

    try {

        const rentals = await db.query(`SELECT rentals.*, customers.name AS "cName", games.name AS "gName" 
        FROM rentals JOIN customers ON rentals."customerId"=customers.id 
        JOIN games ON rentals."gameId"=games.id;`);

        const newsRentals = [];
        for (let index = 0; index < rentals.rows.length; index++) {
            newsRentals.push({
                id: rentals.rows[index].id,
                customerId: rentals.rows[index].customerId,
                gameId: rentals.rows[index].gameId,
                rentDate: rentals.rows[index].rentDate,
                daysRented: rentals.rows[index].daysRented,
                returnDate: rentals.rows[index].returnDate,
                originalPrice: rentals.rows[index].originalPrice,
                delayFee: rentals.rows[index].delayFee,
                customer: {
                    id: rentals.rows[index].customerId,
                    name: rentals.rows[index].cName,
                },
                game: {
                    id: rentals.rows[index].gameId,
                    name: rentals.rows[index].gName
                }
            })
        }

        res.send(newsRentals);

    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function endRental(req, res) {

    const { id } = req.params;

    try {

        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (rental.rows.length <= 0) return res.sendStatus(404);
        if (rental.rows[0].returnDate !== null) return res.sendStatus(400);

        const returnDate = dayjs().format("YYYY-MM-DD");
        const delayFee = ((dayjs(returnDate).valueOf() - dayjs(rental.rows[0].rentDate).valueOf()) * 1.1574074074074074e-8)
            * (rental.rows[0].originalPrice / rental.rows[0].daysRented);
        await db.query(`UPDATE rentals
        SET "returnDate" = $1, "delayFee" = $2
        WHERE id = $3;`, [returnDate, delayFee, id]);
        res.send();

    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function deleteRental(req, res) {

    const { id } = req.params;

    try {

        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (rental.rows.length <= 0) return res.sendStatus(404);
        if (rental.rows[0].returnDate === null) return res.sendStatus(400);

        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id]);
        res.send();

    } catch (err) {
        res.status(500).send(err.message);
    }

}