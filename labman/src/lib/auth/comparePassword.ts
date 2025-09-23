import bcrypt from 'bcrypt';

export default function comparePassword(password: string, hashedPassword: string) {
    console.log(password, hashedPassword);
    return bcrypt.compare(password, hashedPassword);
}