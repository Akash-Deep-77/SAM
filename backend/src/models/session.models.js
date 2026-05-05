import mongoose, {Schema} from "mongoose";

const sessionSchema = new Schema( 
    {
        facultyStarted: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
            required: true
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clas',
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        startedAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        endedAt: {
            type: Date,
            default: () => new Date(Date.now() + 2 * 60 * 1000), 
            required: true
        },
        BLE_token: {
            type: String,
            required: true,
            unique: true,
            trim: true
        }
    }, 
    { timestamps: true }
)

export const Session = mongoose.model("Session", sessionSchema)