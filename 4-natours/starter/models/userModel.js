import crypto from "crypto";
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
        minlength: [10, 'A user password must have more or equal then 10 characters'],
        select: false
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
    },
    passwordChangedAt: {
        type: Date
    },
    passwordResetToken: {
        type: String
    },
    passwordResetTokenExpires: {
        type: Date
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide', 'lead-guide'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next()

    this.passwordChangedAt = Date.now() + 120 * 60 * 1000 - 1000
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPassword = function(JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const convertedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimeStamp < convertedTimeStamp 
    }

    return false
}

userSchema.pre(/^find/, function(next) {
    this.find({ active: { $ne: false } })
    next()
})

userSchema.methods.createPasswordResetToken = function() {
    const token = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 130 * 60 * 1000

    console.log({ token }, this.passwordResetToken, Date.parse(this.passwordResetTokenExpires))

    return token
}

const User = mongoose.model('User', userSchema);

export default User;
