import mongoose from 'mongoose';
const schema = mongoose.Schema;

const ProjectSchema = new schema({
    project: {
        type: String,
        required: true
    },
    tasks: Array,
    description : String,
    status: String,
    company : String,
    projectleader : String,
    weeklyduration : Number,
    hourlyrate : Number,
    current_users: Number,
    comments: Object,
    datecreated : {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('project',ProjectSchema);