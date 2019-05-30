/*
  This takes a normal graphql variables object, and turns it into the correct
  format for file uploads. The spec can be found here and is built in to 
  Apollo server: https://github.com/jaydenseric/graphql-multipart-request-spec
*/
let createGraphQLFileMap = (
  variables,
  path = 'variables',
  filesMap = {},
  files = [],
  count = -1,
) => {
  Object.keys(variables).forEach(key => {
    if (variables[key] instanceof FileList) {
      [...variables[key]].forEach(file => {
        filesMap[(count += 1)] = [path + '.' + key + '.' + count];
        files.push(file);
      });
    }
    // we need to recursively look through the variables object to find the file list, so we can create the map
    if (typeof variables[key] === 'object')
      return createGraphQLFileMap(
        variables[key],
        path + '.' + key,
        filesMap,
        files,
        count,
      );
  });

  //If there is a single file, we need to remove the .0 on the end.
  if (Object.keys(filesMap).length === 1)
    filesMap[0] = [filesMap[0][0].replace('.0', '')];
  return { filesMap, files };
};

export default createGraphQLFileMap;
