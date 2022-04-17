import keys from './keys';
import * as redis from 'redis';

(async () => {
    const redisClient = redis.createClient({
        socket: {
            host: keys.redisHost,
            port: keys.redisPort,
            reconnectStrategy: () => 1000
        } as {[key:string]: string | number | (() => number)},
    })
    await redisClient.connect()

    const sub = redisClient.duplicate()
    await sub.connect()

    function fib(index: number): number {
        if (index < 2) return 1;
        return fib(index - 1) + fib(index - 2)
    }

    sub.on('message', (channel: any, message: string) => {
        redisClient.hSet('values', message, fib(parseInt(message)));
    })

    sub.subscribe('insert', (message: string) => console.log(message))

})();
