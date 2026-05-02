import mongoose, {Schema} from "mongoose";

const clasSchema = new schema( 
    {
        year: {
            type: Number,
            required: [true, 'Academic year is required'],
            min: 1,
            max: 4
        },
        semester: {
            type: Number,
            required: [true, 'Semester is required'],
            min: 1,
            max: 8 
        },
        branch: {
            type: String,
            required: [true, 'Branch (e.g., CSE, IT) is required'],
            trim: true
        },
        section: {
            type: String,
            required: false, 
            trim: true,
            uppercase: true
        },
        subjects: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject' 
            }
        ],
        studentsEnrolled: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
            }
        ]
        }, 
        { timestamps: true }
)

export const Clas = mongoose.model("Clas", clasSchema)