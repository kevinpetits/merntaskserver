const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');
const { findOneAndUpdate } = require('../models/Task');

exports.createTask = async (req, res) => {
    // Validating errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Project
    const {projectId} = req.body;
    try {
        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).json({msg: 'Project not found'});
        }

        //Check the project user
        if(project.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'Unauthorized'})
        }

        //Creating the task
        const task = new Task(req.body);
        await task.save();
        res.json({task});
    } catch (error) {
        console.log(error);
        res.status(500).send('An error has occurred')
    }
}

exports.getTasks = async (req, res) => {
    try {
        const {projectId} = req.query;
        const project = await Project.findById(projectId);
        if(!project){
            return res.status(404).json({msg: 'Project not found'});
        }

        //Check the project user
        if(project.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'Unauthorized'})
        }

        const tasks = await Task.find({projectId: projectId}).sort({created: -1});
        res.json({tasks});
    } catch (error) {
        console.log(error);
        res.status(500).send('An error has occurred')
    }
}

exports.updateTask = async (req, res) => {
    try {
        const {projectId, taskName, status} = req.body;

        let task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({msg: 'Task not found'});
        }

        const project = await Project.findById(projectId);

        //Check the project user
        if(project.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'Unauthorized'})
        }

        const newTask = {};
        newTask.taskName = taskName;
        newTask.status = status;

        //Updating the new task
        task = await Task.findOneAndUpdate({_id: req.params.id}, newTask, {new: true});
        
        res.json({task});
    } catch (error) {
        console.log(error);
        res.status(500).send('An error has occurred')
    }
}

exports.deleteTask = async (req, res) => {
    try {
        const {projectId} = req.query;

        let task = await Task.findById(req.params.id);
        if(!task){
            return res.status(404).json({msg: 'Task not found'});
        }

        const project = await Project.findById(projectId);

        //Check the project user
        if(project.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'Unauthorized'})
        }


        //Deleting the task
        await Task.findOneAndDelete({_id: req.params.id});

        res.json({msg: 'Task deleted'});
    } catch (error) {
        console.log(error);
        res.status(500).send('An error has occurred')
    }
}