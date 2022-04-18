import mongoose from 'mongoose';
const schema = mongoose.Schema;

const UsersSchema = new schema({
    name: {
        type: String,
        required: true
    },
    company: String,
    company_id : Number,
    project_id : Number,
    user_id: {
        type: String,
        default: () => {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    },
    projects: Object,
    client_company: String,
    global_manager: String,
    role : {
        type: Number,
        default: 1989
    },
    access_level: {
        type: Number,
        default: 1
    },
    rate_per_hour: Number,
    hours_per_week: Number,
    tasks: Object,
    start_date : Date,
    end_date : Date,
    ratings : Object,
    status : String,
    current_users: String,
    skills: String,
    email: String,
    contact_number: String,
    timeout: {
        type: Number,
        default:180
    },
    interval : {
        type: Number,
        default: 180
    },
    snaps : {
        type: Number,
        default: 300
    },
    last_session: String,
    last_recorded_time: {
        type: Number,
        default: 0
    },
    created_at :{
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('user',UsersSchema);