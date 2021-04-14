import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';

const typesArray = loadFilesSync(path.join(__dirname, './schema'));

const typeDefs = mergeTypeDefs(typesArray);

module.exports = typeDefs;
