import mongoose, {Schema} from "mongoose";

const timetableSchema = new schema( 
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Clas',
            required: [true, 'Timetable must be linked to a specific class']
        },
        day: {
            type: String,
            required: true,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            trim: true
        },
        lectures: [
            {
                order: {
                    type: String,
                    required: true, 
                    // Using Roman numerals as you suggested (I, II, III...)
                    enum: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
                },
                startTime: {
                    type: String, // Storing as string "09:00 AM" for easier display
                    required: true
                },
                endTime: {
                    type: String,
                    required: true
                },
                details: {
                    subject: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Subject',
                        required: true
                    },
                    faculty: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Faculty',
                        required: true
                    }
            }
        }]

    }, 
    { timestamps: true }
)

export const TimeTable = mongoose.model("TimeTable", timetableSchema)