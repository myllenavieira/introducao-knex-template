import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/bands", async (req: Request, res: Response) => {
    try {

        const result = await db.raw(
            `SELECT * FROM bands;`
        )

        res.status(200).send({ result })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/bands", async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        // const id = Date.now()
        const name: string = req.body.name

        if (!id || !name) {
            res.status(400)
            throw new Error("Dados inválidos, inserir dados válidos.")
        }
        if (name.length < 3) {
            res.status(400)
            throw new Error("Nome muito curto, use pelo menos 3 caracteres.")
        }

        await db.raw(`
            INSERT INTO bands (id, name) 
            VALUES("${id}", "${name}");
        `)

        res.status(201).send({ message: "Banda criada" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/bands/:id", async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id
        const name: string = req.body.name

        if (!id) {
            res.status(400)
            throw new Error("Id inválido, inserir um id válido.")
        }
        if (!name) {
            res.status(400)
            throw new Error("Name inválido, inserir um name válido.")
        }
        if (name.length < 3) {
            res.status(400)
            throw new Error("Nome muito curto, use pelo menos 3 caracteres.")
        }

        const [band] = await db.raw(`
            SELECT * FROM bands
            WHERE id = "${id}";
        `) // desconstrução ou band[0]

        if (!band) {
            res.status(404)
            throw new Error("Banda não encontrada.")
        }
        await db.raw(`
            UPDATE bands
            SET name = "${name}"
            WHERE id = "${id}";
        `)

        res.status(201).send({ message: "Banda alterada" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/songs", async (req: Request, res: Response) => {
    try {

        const result = await db.raw(
            `SELECT * FROM songs;`
        )

        res.status(200).send({ result })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/songs", async (req: Request, res: Response) => {
    try {
        const id = req.body.id
        const name: string = req.body.name
        const band_id = req.body.band_id

        if (!id || !name) {
            res.status(400)
            throw new Error("Dados inválidos, inserir dados válidos.")
        }
        if (name.length < 3) {
            res.status(400)
            throw new Error("Nome muito curto, use pelo menos 3 caracteres.")
        }

        const [band] = await db.raw(`
            SELECT * FROM bands
            WHERE id = "${band_id}";
        `)

        if (!band) {
            res.status(404)
            throw new Error("Banda não encontrada.")
        }

        await db.raw(`
            INSERT INTO songs (id, name, band_id) 
            VALUES("${id}", "${name}", "${band_id}");
        `)

        res.status(201).send({ message: "Música criada" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/songs/:id", async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id

        const newId = req.body.id
        const newName = req.body.name
        

        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'id' deve ser string.")
            }

            if (newId.length < 1) {
                res.status(400)
                throw new Error("'id' deve possuir no mínimo 1 caractere.")
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("'name' deve ser string.")
            }
            if (newName.length < 2) {
                res.status(400)
                throw new Error("'name' deve possuir no mínimo 2 caracteres.")
            }
        }

        const [song] = await db.raw(`
					SELECT * FROM songs
					WHERE id = "${id}";
				`)


        if (song) {
            await db.raw(`
							UPDATE songs
							SET
								id = "${newId || song.id}",
								name = "${newName || song.name}"
							WHERE
								id = "${id}";
						`)

        } else {
            res.status(404)
            throw new Error("'id' não encontrada")
        }

        res.status(200).send({ message: "Atualização realizada com sucesso" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})