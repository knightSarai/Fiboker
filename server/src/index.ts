import express from 'express';
import bodyParser from 'body-parser';
import * as redis from 'redis';
import {Pool} from 'pg';
import cors from 'cors';
import keys from './keys';

(async () => {
const app = express();

app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    port: keys.pgPort,
    database: keys.pgDatabase,
    password: keys.pgPassword
} as {[key:string]:string | number})

pgClient.on('error', () => console.log("Lost PG connection"))
pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

const redisClient = redis.createClient({
    socket: {
        host: keys.redisHost,
        port: keys.redisPort,
        reconnectStrategy: () => 1000
    } as {[key:string]: string | number | (() => number)},
})
await redisClient.connect()

const pub = redisClient.duplicate()
await pub.connect()

app.get('/', (req, res) => {
    res.send('hi')
})

app.get('values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values')
    res.send(values.rows)
})

app.get('values/current', async (req, res) => {
    const values = await redisClient.hGetAll('values')
    res.send(values)
})

app.post('values', async(req, res) => {
    const index = req.body.index;
    if(parseInt(index) > 40) return res.status(422).send('Index to high')
    redisClient.hSet('values', index, 'Nothing yet!')
    await pub.publish('insert', 'message')
    pgClient.query("INSERT INTO values(number) VALUES($1)", [index])
    res.send({working: true})
})

app.listen(5000, () => console.log("Start on port 5000"))

})();
