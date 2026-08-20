import mongoose from "mongoose"

//options schema which will be passed in the questions schema
const optionsSchema = new mongoose.Schema({
    optionId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    nextQuestionId: {
        type: String,
        default: null
    },
    nextModuleId: {
        type: String,
        default: null
    }
}, { _id: false })

//question schema which will be pass indise module schema
const questionSchema = new mongoose.Schema({
    questionId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    isCheckPoint: {
        type: Boolean,
        default: false
    },
    options: {
        type: [optionsSchema],
        default: []
    }
}, {
    _id: false
})
const moduleSchema = new mongoose.Schema({
    moduleId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    questions: {
        type: [questionSchema],
        default: []
    }
}, {
    timestamps: true
})
const Module = mongoose.model("Module", moduleSchema);
export default Module;