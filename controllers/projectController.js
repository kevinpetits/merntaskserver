const Project = require('../models/Project');
const { validationResult } = require('express-validator')

exports.createProject = async (req, res) => {

    // Validating errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Create project
        const project = new Project(req.body);

        //Saving the user from JWT
        project.user = req.user.id;

        //Saving the project
        project.save();
        res.json(project);
    } catch (error) {
        console.log(error);
        res.status(500).send('An error has occurred')
    }
}

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({user: req.user.id}).sort({created: -1});
        res.json({projects})
    } catch (error) {
        console.log(error);
        res.status(500).send('An error has occurred')
    }
}

//update projects
exports.updateProject = async(req, res) => {
    // Validating errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {projectName} = req.body;
    const newProject = {};
    if(projectName){
        newProject.projectName = projectName;
    }

    try {
        //Check ID
        let project = await Project.findById(req.params.id);

        //Check if project exists
        if(!project){
            return res.status(404).json({msg: 'Project not found'})
        }
        //Check the project user
        if(project.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'Unauthorized'})
        }

        //update
        project = await Project.findByIdAndUpdate({_id: req.params.id}, {$set: newProject}, {new: true});

        res.json({project})

    } catch (error) {
        console.log(error);
        res.status(500).send('An error has occurred');
    }
}

exports.deleteProject = async (req, res) => {
    try {
        //Check ID
        let project = await Project.findById(req.params.id);

        //Check if project exists
        if(!project){
            return res.status(404).json({msg: 'Project not found'})
        }
        //Check the project user
        if(project.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'Unauthorized'})
        }

        //delete
        await Project.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Project deleted'});

    } catch (error) {
        console.log(error);
        res.status(500).send('An error has occurred');
    }
}