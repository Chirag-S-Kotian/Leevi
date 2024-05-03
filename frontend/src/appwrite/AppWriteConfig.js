import { Client, Account, Databases } from "appwrite";

export const PROJECT_ID = "663256580037cfa25fbf";
export const DATABASE_ID = "663257af0032d380e884";
export const COL_ID_MSGS = "66325b4a001a231496c4";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("663256580037cfa25fbf");

export const account = new Account(client);
export const databases = new Databases(client);

export default client;
