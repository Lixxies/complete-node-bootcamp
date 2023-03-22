import fs from 'fs';

import EncryptPassword from './encrypt.js';

process.env.UV_THREADPOOL_SIZE = 2;

setTimeout(() => console.log('Timeout 1 finished'), 0);
setImmediate(() => console.log('immediate 1 finished'));

fs.readFile('test-file.txt', () => {
    console.log('I/O finished');
    console.log('-----------------');

    setTimeout(() => console.log('Timeout 2 finished'), 0);
    setTimeout(() => console.log('Timeout 3 finished'), 3000);
    setImmediate(() => console.log('immediate 2 finished'));

    process.nextTick(() => console.log('Process.nextTick'))

    EncryptPassword();
    EncryptPassword();
    EncryptPassword();
    EncryptPassword();
})

console.log('Hello from the top-level code');
