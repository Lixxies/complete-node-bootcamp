import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        unique: true,
        trim: true,
        maxlength: [40, 'A user name must have less or equal then 40 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: [40, 'A user email must have less or equal then 40 characters'],
        minlength: [10, 'A user email must have more or equal then 10 characters'],
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        trim: true,
        maxlength: [40, 'A user password must have less or equal then 40 characters'],
        minlength: [10, 'A user password must have more or equal then 10 characters']
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        trim: true,
        maxlength: [40, 'A user password confirmation must have less or equal then 40 characters'],
        minlength: [10, 'A user password confirmation must have more or equal then 10 characters'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(psw) {
                return psw === this.password
            },
            message: 'Passwords are not the same!'
        }
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

const User = mongoose.model('User', userSchema);

export default User;
