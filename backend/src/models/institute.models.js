import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const instituteSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
            index: true
        },
        representativeName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        designation: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        instId:{
            type: String,
            required: true
        },
        instIdS:{
            type: String,
            required: true
        },
        faculty:[
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty'
            }
        ], 
        classes:[
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clas'
            }
        ],
        refreshToken: {
            type: String
        }
    },
    {timestamps: true}
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            instId: this.instId,
            instIdS: this.instIdS
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Institute = mongoose.model("Institute", instituteSchema)