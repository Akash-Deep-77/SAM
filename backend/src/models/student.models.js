import mongoose, {Schema} from "mongoose";

const studentSchema = new Schema( 
    {
        institute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Institute',
            required: [true, 'Institute reference is required']
        },
        universityRollNo: {
            type: String,
            required: [true, 'University Roll Number is required'],
            unique: true,
            uppercase: true,
            trim: true
        },
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        branch: {
            type: String,
            required: true,
            enum: ['CSE', 'EEE', 'ECE', 'MECH', 'CIVIL', 'IT'], 
            trim: true
        },
        year: {
            type: Number,
            required: true,
            min: 1,
            max: 4
        },
        semester: {
            type: Number,
            required: true,
            min: 1,
            max: 8
        },
        section: {
            type: String,
            required: false, 
            uppercase: true,
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
        },
        subjects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }],
        attendanceSubjectwise: [{
            subject: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Subject',
                required: true
                },
            date: {
                type: Date,
                required: true,
                default: Date.now
                },
            status: {
                type: String,
                required: true,
                enum: ['Present', 'Absent'],
                default: 'Present'
                }
        }]
    }, 
    { timestamps: true }
)

export const Student = mongoose.model("Student", studentSchema)