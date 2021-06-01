const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (doc, transformedUser) => {
    transformedUser.id = transformedUser._id
    delete transformedUser._id
    delete transformedUser.__v
    delete transformedUser.passwordHash
  }
})

const User = model('User', userSchema)

module.exports = User
