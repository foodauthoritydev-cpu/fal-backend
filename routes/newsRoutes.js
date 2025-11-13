const express = require('express')
const header = express.Router()
const posts = express.Router()
const { getHeader, updateHeader } = require('../controllers/newsHeaderController')
const { createPost, listPosts, getPost, updatePost, deletePost, deleteImage } = require('../controllers/newsPostController')

header.get('/', getHeader)
header.put('/', updateHeader)

posts.get('/', listPosts)
posts.post('/', createPost)
posts.get('/:id', getPost)
posts.put('/:id', updatePost)
posts.delete('/:id', deletePost)
posts.delete('/:id/images/:index', deleteImage)

module.exports = { header, posts }
