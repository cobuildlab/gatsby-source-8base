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
`Example of how to create pages dynamically.
 In the case of an image in the query, the name of the filename and downloadUrl field are important, since they are used to verify that an image exists and make the corresponding optimization.`
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
                  imageUrl {
                    id
                    filename
                    downloadUrl
                  }
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
            path: `/blog/${data.slug}`,
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
My template:
```javascript
// myTemplate.js

import React, { Fragment } from "react"

function myTemplate({ pageContext }) {
  const { data } = pageContext;
  const { title, content, remoteImage  } = data;
  return (
    <Fragment>
      <div className="blog-post-container">
        <div className="blog-post">
          <h1> {title} </h1>
          <div> {content} </div>
        </div>
        <div className="blog-post-image">
          <img src={remoteImage.publicURL} alt="" />    
        </div>
      </div>
    </Fragment>
  )
}
export default myTemplate
```

[create by cobuildlab](https://cobuildlab.com/)

