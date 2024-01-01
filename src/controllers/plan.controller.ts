import { Request, Response } from 'express';
import { Plan } from '../models';

// Create a new Plan
export const createPlan = async (req: Request, res: Response) => {
    const newPlan = new Plan( req.body);
    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
};

// Get all Plans
export const getAllPlans = async (_req: Request, res: Response) => {
    const Plans = await Plan.find()
    res.status(200).json(Plans);
};

// Get Plan by ID
export const getPlanById = async (req: Request, res: Response) => {
    const plan = await Plan.findById(req.params.id)
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(plan);
};

// Update Plan by ID
export const updatePlanById = async (req: Request, res: Response) => {
    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(updatedPlan);
};

// Delete Plan by ID
export const deletePlanById = async (req: Request, res: Response) => {
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    if (!deletedPlan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    res.status(200).json(deletedPlan);
};
