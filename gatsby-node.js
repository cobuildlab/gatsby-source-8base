const { GraphQLClient } = require("graphql-request");
const POST_NODE_TYPE = `8BasePost`;

exports.sourceNodes = async (
  {
    actions,
    createNodeId,
    createContentDigest,
    options
  },
  {
    url,
    apiToken,
    workspaceId,
    queryGraphQL
  }) => {

  const { createNode } = actions;

  //Connect to workspace 8base
  const client = new GraphQLClient(`${url}/${workspaceId}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`
    }
  });

  // Request graphql query
  const query = await client.request(queryGraphQL);
  const data = await query;

  // Process data into nodes.
  data.postsList.items.forEach(value => {
    const nodeContent = JSON.stringify(value);
    const nodeMeta = {
      id: createNodeId(`post-${value.id}`),
      parent: null,
      children: [],
      internal: {
        type: POST_NODE_TYPE,
        content: nodeContent,
        contentDigest: createContentDigest(value)
      }
    };
    const node = Object.assign({}, value, nodeMeta);
    createNode(node);
  });
  return
};
