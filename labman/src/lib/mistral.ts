import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

export const mistralClient = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY,
});

