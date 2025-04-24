import mongoose from "mongoose";
import { getEnvVar } from "../utils/getEnvVar.js";


 export async function initMongoConnection() {
    try {
        const user = getEnvVar('MONGO_USER');
        const pwd = getEnvVar('MONGO_PASSWORD');
        const url = getEnvVar('MONGO_URL');
        const db = getEnvVar('MONGO_DB');

        await mongoose.connect(`mongodb+srv://${user}:${pwd}@${url}/${db}?retryWrites=true&w=majority`,);
        console.log('Mongo connection successfully established');
    } catch (error) {
        console.error('Error while setting up Mongo connection', error);
        throw error;
    }
 }