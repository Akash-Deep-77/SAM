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
            //required: true
        },
        instIdS:{
            type: String,
            //required: true
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

instituteSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
})

instituteSchema.pre("save", async function (next) {
    if (!this.isModified("name")) return;

    function generateCodes(input) {
    // Extract first letter of each word, skip small words like "&", "of", "the" etc.
    const skipWords = new Set(["of", "and", "&", "the", "a", "an", "in", "at", "for"]);

    const acronym = input
        .split(" ")
        .filter(word => !skipWords.has(word.toLowerCase()) && word.length > 0)
        .map(word => word[0].toUpperCase())
        .join("");

    // Generate random numbers of given length
    const randomDigits = (length) =>
        Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

    const code4 = `${acronym}${randomDigits(4)}`;
    const code6 = `${acronym}${randomDigits(6)}`;

    return { code4, code6 };
    }

    const { code4, code6 } = generateCodes(this.name);
    this.instId = code4;
    this.instIdS = code6;
})

instituteSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

instituteSchema.methods.generateAccessToken = function(){
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

instituteSchema.methods.generateRefreshToken = function(){
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