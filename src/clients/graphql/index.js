import request from '../xhr/request';
import createFileMap from './create-file-map';

export const createGraphQLClient = ({ baseUrl, modifyRequest }) => ({
  onProgress,
  ...options
}) => {
  let modifiedOptions = modifyRequest(options);

  var body = new FormData();
  body.append(
    'operations',
    JSON.stringify({
      query: options.mutation.loc.source.body,
      variables: options.variables,
    }),
  );

  let { files, filesMap } = createFileMap(options.variables);

  body.append('map', JSON.stringify(filesMap));
  files.forEach((file, index) => body.append(index, file));

  return request({
    body,
    onProgress,
    request: {
      ...modifiedOptions,
      url: `${baseUrl}${options.path || ''}`,
    },
  });
};
