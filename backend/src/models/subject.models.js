import mongoose, {Schema} from "mongoose";

const subjectSchema = new schema( 
    {
        subjectName: {
            type: String,
            required: [true, 'Subject name is required'],
            trim: true
        },
        subjectCode: {
            type: String,
            required: [true, 'Subject code is required'],
            unique: true, 
            uppercase: true,
            trim: true
        },
        facultyAssigned: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
            required: [true, 'A subject must have an assigned faculty member']
        },
        classes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Clas'
            }
        ]
    }, 
    { timestamps: true }
)

export const Subject = mongoose.model("Subject", subjectSchema)