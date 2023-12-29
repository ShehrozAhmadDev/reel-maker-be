import { Request, Response } from 'express';
import { Project } from '../models';

// Create a new project
export const createProject = async (req: Request, res: Response) => {
    const newProject = new Project( req.body);
    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
};

// Get all projects
export const getAllProjects = async (_req: Request, res: Response) => {
    const projects = await Project.find().populate("createdBy");
    res.status(200).json(projects);
};

// Get project by ID
export const getProjectById = async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id).populate("createdBy");
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
};

// Update project by ID
export const updateProjectById = async (req: Request, res: Response) => {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(updatedProject);
};

// Delete project by ID
export const deleteProjectById = async (req: Request, res: Response) => {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(deletedProject);
};
