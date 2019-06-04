import request from '../xhr/request';
import { extractFiles } from 'extract-files';

/* 
  Extract files is the official package used by the developer who helped
  create the graphql upload spec in apollo client / server
  code here is similar: https://github.com/jaydenseric/graphql-react/blob/1b1234de5de46b7a0029903a1446dcc061f37d09/src/universal/graphqlFetchOptions.mjs
*/

export const createGraphQLClient = ({ baseUrl, modifyRequest }) => ({
  onProgress,
  options,
}) => {
  let modifiedOptions = modifyRequest ? modifyRequest(options) : options;

  const { clone, files } = extractFiles({
    query: options.mutation.loc.source.body,
    variables: options.variables,
  });

  var body = new FormData();
  body.append('operations', JSON.stringify(clone));

  const map = {};
  let i = 0;
  files.forEach(paths => {
    map[++i] = paths;
  });
  body.append('map', JSON.stringify(map));

  i = 0;
  files.forEach((paths, file) => {
    body.append(`${++i}`, file, file.name);
  });

  return request({
    body,
    onProgress,
    request: {
      ...modifiedOptions,
      url: `${baseUrl}${options.path || ''}`,
    },
  });
};
