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
    console.log(req.body);
    try{
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.unit_price),
                    currency_id: "ARS",
                },
            ],
            back_urls: {
                success: "https://fiuba-reads.vercel.app/success",
                failure: "https://fiuba-reads.vercel.app/failure",
                pending: "https://fiuba-reads.vercel.app/pending",
            },
            auto_return: "approved",
        };
        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });
    }catch(error){
        console.log(error);
        const status = error.status || 500;
        res.status(status).json({ error: error.message, status: status });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});