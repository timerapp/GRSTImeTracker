import mongoose from 'mongoose';

const schema = mongoose.Schema;

const ItemSchema = new schema({
    user_id: String,
    mouse: {
        type:Number,
        default: 0
    },
    keyboard: {
        type:Number,
        default: 0
    },
    mousemove: {
        type:Number,
        default: 0
    },
    created_at :{
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('snap', ItemSchema);