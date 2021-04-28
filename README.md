# gatsby-source-8base

Source plugin for [Gatsby](https://www.gatsbyjs.org/).

## Install

`npm install --save gatsby-source-8base`

## How to Use

```javascript
// In gatsby-config.js
plugins:[
  {
    resolve: "gatsby-source-8base",
    options: {
      url: 'https://api.8base.com',
      apiToken: "xxxxxxxx",
      workspaceId: "xxxxxxx",
      queryGraphQL: `
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
