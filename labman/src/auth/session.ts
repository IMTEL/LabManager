import prisma from '@/lib/prisma';
const sessionExpiresInSeconds = 60 * 60 * 24;

// Generates a true random string of length 24
function generateSecureRandomString(): string {

    const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";


    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);

    let id = "";
    for (let i = 0; i < bytes.length; i++) {

        id += alphabet[bytes[i] >> 3];
    }
    return id;
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    let c = 0;
    for (let i = 0; i < a.byteLength; i++) {
        c |= a[i] ^ b[i];
    }
    return c === 0;
}

// Creates a new sessions and stoores it in the database
export async function createSession(): Promise<SessionWithToken> {
    const now = new Date();

    const id = generateSecureRandomString();
    const secret = generateSecureRandomString();
    const secretHash = await hashSecret(secret);

    const token = `${id}.${secret}`;

    const sessionRecord = await prisma.session.create({
        data: {
            id,
            secretHash: Buffer.from(secretHash),
            createdAt: now
        }
    });

    const session: SessionWithToken = {
        ...sessionRecord,
        token
    };

    return session;
}
// Hashes a secret using SHA-256
async function hashSecret(secret: string): Promise<Uint8Array> {
    const secretBytes = new TextEncoder().encode(secret);
    const secretHashBuffer = await crypto.subtle.digest("SHA-256", secretBytes);
    return new Uint8Array(secretHashBuffer);
}

// Validates a session token and returns the session if valid
export async function validateSessionToken(token: string): Promise<Session | null> {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 2) return null;

    const [sessionId, sessionSecret] = tokenParts;

    const session = await getSession(sessionId);
    if (!session) return null;

    const tokenSecretHash = await hashSecret(sessionSecret);
    const validSecret = constantTimeEqual(tokenSecretHash, session.secretHash);
    if (!validSecret) return null;

    return session;
}
// Gets a session by its ID
async function getSession(sessionId: string): Promise<Session | null> {
    const now = new Date();


    const sessionRecord = await prisma.session.findUnique({
        where: { id: sessionId },
    });

    if (!sessionRecord) return null;


    if (now.getTime() - sessionRecord.createdAt.getTime() >= sessionExpiresInSeconds * 1000) {
        await deleteSession(sessionId);
        return null;
    }

    return sessionRecord;
}

async function deleteSession(sessionId: string): Promise<void> {
    await prisma.session.delete({
        where: { id: sessionId },
    });
}



interface SessionWithToken extends Session {
    token: string;
}

interface Session {
    id: string;
    secretHash: Uint8Array | Buffer;
    createdAt: Date;
}