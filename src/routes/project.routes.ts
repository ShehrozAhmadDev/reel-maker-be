import { Router } from "express";
import { catchErrors } from "../middleware/error.middleware";
import {  verifyToken } from "../middleware/auth.middleware";
import {
    createProject,
    getAllProjects,
    getProjectById,
    updateProjectById,
    deleteProjectById,
  } from '../controllers/project.controller';

const router: Router = Router();

router.post('/',verifyToken, catchErrors(createProject));

// Get all projects
router.get('/',verifyToken, catchErrors(getAllProjects));

// Get project by ID
router.get('/:id',verifyToken ,catchErrors(getProjectById));

// Update project by ID
router.put('/:id',verifyToken, catchErrors(updateProjectById));

// Delete project by ID
router.delete('/:id', verifyToken, catchErrors(deleteProjectById));
export default router;
