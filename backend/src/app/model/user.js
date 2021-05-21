const mongoose = require('../../database')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: Date,
        select: false
    },
	 admin: {
		 type: Boolean
	 },
	 image: {
		type: String,
		required: true
	 },
	 nivel: {
		type: Number,
		default: 1
	 },
	 cidade: {
		type: String
	 },
	 recuperados: {
		type: Number,
		default: 0
	 },
    createdAt:{
        type: Date,
        default: Date.now,
    }
})

// UserSchema.pre('save', async function(next){
//     const hash = await bcrypt.hash(this.password, 10)
//     this.password = hash

//     next()
// })

const User = mongoose.model('User', UserSchema)
module.exports = User;