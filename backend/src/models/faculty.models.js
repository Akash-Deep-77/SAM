import mongoose, {Schema} from "mongoose";

const facultySchema = new Schema( 
    {
        insIdS: {
            type: String,
            required: [true, 'Institute ID-S is required'],
            unique: false,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        facultyIdNumber: { 
            type: String,
            required: [true, 'Faculty Identification Number is required'],
            unique: true,
            uppercase: true,
            trim: true
        },
        gender: {
            type: String,
            required: true,
            enum: ['Male', 'Female', 'Other']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        subjects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }],
        classes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clas'
        }],
        timetableAssociated: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Timetable'
        }]
    }, 
    { timestamps: true }
)

export const Faculty = mongoose.model("Faculty", facultySchema)