import crypto from 'crypto';

export default function EncryptPassword() {
    const start = Date.now();

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        console.log(Date.now() - start, 'Password encrypted');
    })
}