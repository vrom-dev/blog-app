const { Schema, model } = require('mongoose')

const blogSchema = new Schema({
  title: {
    type: String,
    minlength: 3,
    required: true
  },
  author: {
    type: String,
    minlength: 3,
    required: true
  },
  url: {
    type: String,
    minlength: 9,
    required: true
  },
  likes: {
    type: Number,
    default: 0
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

blogSchema.set('toJSON', {
  transform: (doc, transformedObject) => {
    transformedObject.id = transformedObject._id
    delete transformedObject._id
    delete transformedObject.__v
  }
})

const Blog = model('Blog', blogSchema)

module.exports = Blog
