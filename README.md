# gatsby-source-8base

Source plugin for [Gatsby](https://www.gatsbyjs.org/).

## Install

`npm install --save @cobuildlab/gatsby-source-8base`

## How to Install in Gatsby

```javascript
// In gatsby-config.js
plugins:[
  {
    resolve: "gatsby-source-8base",
    options: {
      url: 'https://api.8base.com',
      apiToken: "xxxxxxxx",
      workspaceId: "xxxxxxx",
      graphqlQuery: `
        query {
          postsList {
            items {
              id
              title
            }
          count
          }
        }
      `
     }
  }
]
```

## How to Use
`Example of how to create pages dynamically`
```javascript
// In your gatsby-node.js

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          query 8BasePost {
            all8BasePost(skip: 0) {
              post: edges {
                post: node {
                  id
                  title
                  slug
                  content
                }
              }
            }
          }
        `
      ).then(response => {
        
        if (response.errors) {
          return reject(response.errors);
        }        
 
        response.data['8BasePost'].post.forEach((data, index) => {
          createPage({
            path: `/blog/`,
            component: path.resolve(`./src/templates/my-template.js`),
            // The context is passed as props to the component as well
            // as into the component's GraphQL query.
            context: {
              data: data
            },
          })
        })
      })
    )
  })
}

```
