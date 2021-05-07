const Utils = require('./src/utils');
const { GraphQLClient } = require('graphql-request');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

const POST_NODE_TYPE = `Post8Base`;

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, options },
  { url, apiToken, workspaceId, graphqlQuery },
) => {
  const { createNode } = actions;

  //Connect to workspace 8base
  const client = new GraphQLClient(`${url}/${workspaceId}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  // Request graphql query
  const query = await client.request(graphqlQuery);
  const data = await query;

  // Process data into nodes.
  data[Object.keys(data)[0]].items.forEach((value) => {

    //validate if objects
    let resp = Utils.validateObject(value, {});

    if (resp.validate) {
      value['downloadUrl'] = resp.imageUrl;
    }

    const nodeContent = JSON.stringify(value);

    const nodeMeta = {
      id: createNodeId(`post-${value.id}`),
      parent: null,
      children: [],
      internal: {
        type: POST_NODE_TYPE,
        content: nodeContent,
        contentDigest: createContentDigest(value),
      },
    };
    const node = Object.assign({}, value, nodeMeta);
    createNode(node);
  });
  return;
};

exports.onCreateNode = async ({
  node, // the node that was just created
  actions: { createNode },
  createNodeId,
  getCache,
}) => {

  if (node.internal.type === POST_NODE_TYPE)
    //if exists image, create remoteUrl
    if (node.downloadUrl){
      const fileNode = await createRemoteFileNode({
        // the url of the remote image to generate a node for
        url: node.downloadUrl,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        getCache,
      });
      if (fileNode) {
        node.remoteImage___NODE = fileNode.id;
      }
  }
};
