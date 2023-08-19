import bodyParser from 'body-parser';

export const appUrlencoded = bodyParser.urlencoded({ extended: false });
export const appJSON = bodyParser.json();
