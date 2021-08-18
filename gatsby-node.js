const Utils = require('./src/utils');
const { GraphQLClient } = require('graphql-request');
const { createRemoteFileNode } = require(`gatsby-source-filesystem`);

let node_type = [];

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, options },
  { url, apiToken, workspaceId, nodeType, graphqlQuery},
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

  node_type = nodeType;

  // Process data into nodes.
  Object.keys(data).map((value, i) => {
    data[value].items.map((dataValue) => {

      //validate if objects
      let resp = Utils.validateObject(dataValue, {});

      if (resp.validate) {
        dataValue['validate'] = resp.validate;
      }

      const nodeContent = JSON.stringify(dataValue);

      const nodeMeta = {
        id: createNodeId(`${nodeType[i]}-${dataValue.id}`),
        parent: null,
        children: [],
        internal: {
          type: nodeType[i],
          content: nodeContent,
          contentDigest: createContentDigest(dataValue),
        },
      };
      const node = Object.assign({}, dataValue, nodeMeta);
      createNode(node);
    });
  });
  return;
};

exports.onCreateNode = async ({
  node, // the node that was just created
  actions: { createNode, createNodeField },
  createNodeId,
  getCache
}) => {

  if (node_type.includes(node.internal.type)) {
    //if exists image, create remoteUrl
    if (node.validate) {
      const images = await Promise.all(
        node.imageUrl.items.map(data => {
          return createRemoteFileNode({
            url: data.downloadUrl,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            getCache,
          })
        })
      );
      // Field with image list
      await createNodeField({
        node,
        name: "images",
        value: images,
      });

      node.fields.images.forEach((image, i) => {
        image.remoteImage___NODE = images[i].id
      })
    }
  }
};
