import express from "express";
import cors from "cors";

import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: "APP_USR-383794574687316-111709-f9d6c63ef2277e6d1566bdd4d6b28bc6-1915421294",
});

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Soy el server :)");
});

app.post("/create_preference", async (req, res) => {
    try{
        const { title, quantity, unit_price, user_id, isbn } = req.body;

        const body = {
            items: [
                {
                    title: title,
                    quantity: Number(quantity),
                    unit_price: Number(unit_price),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: `https://fiuba-reads.vercel.app/success?userId=${user_id}&bookId=${isbn}&price=${unit_price}`,
                failure: `https://fiuba-reads.vercel.app/failure?userId=${user_id}&bookId=${isbn}`,
                pending: `https://fiuba-reads.vercel.app/pending?userId=${user_id}&bookId=${isbn}`,
            },
            auto_return: "approved",
        };
        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });
    }catch(error){
        console.error(error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message, status: status });
    }
});

app.listen(port, () => {
    console.info(`Server running on port ${port}`);
});