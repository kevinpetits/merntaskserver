const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Project', ProjectSchema);