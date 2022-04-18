import mongoose from 'mongoose';
const schema = mongoose.Schema;

const ErrorLogSchema = new schema({
    user_id: {
        type: String,
        required: true
    },
    task: String,
    project: String,
    description : String,
    errorlog : String,
    OSDescription: String,
    FrameworkDescription: String,
    OSArchitecture: String,
    ProcessArchitecture: String,
    datecreated : {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('error',ErrorLogSchema);