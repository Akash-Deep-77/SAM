import mongoose, {Schema} from "mongoose";

const attendanceSchema = new schema( 
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
            required: [true, 'Attendance must be linked to a session']
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Attendance must be linked to a student']
        },
        markedAt: {
            type: Date,
            default: Date.now,
            required: true
        }
    }, 
    { timestamps: true }
)

export const Attendance = mongoose.model("Attendance", attendanceSchema)