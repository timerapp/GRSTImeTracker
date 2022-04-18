import mongoose from 'mongoose';
const schema = mongoose.Schema;

const ActivitySchema = new schema({
    name: {
        type: String,
        required: true
    },
    date : String,
    status : String,

    user_id : String,
    project_id : String,
    task_id : String,

    project : String,
    task : String,

    breakSnap : Number,
    meetingSnap : Number,

    partialTime : Number,
    totalTime : Number,
    idleTime : Number,
    keyboard : Number,
    mouse : Number,
    
    apps : Object,
    created_at : {
        type: Date,
        default: Date.now
    }
})


export default mongoose.model('activity',ActivitySchema);