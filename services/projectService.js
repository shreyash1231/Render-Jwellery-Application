const Project = require("../models/projectModel");
const { toCreateProjectDTO, toUpdateProjectDTO, toPublicProject } = require('../dto/project.dto');

class ProjectService {

    async createProject(data) {
        const dto = toCreateProjectDTO(data);
        const project = await Project.create(dto);
        return { success: true, message: "Project created successfully", data: toPublicProject(project) };
    }

    async getAllProject() {
        const projects = await Project.find().populate("domainId").sort({ createdAt: -1 });
        if (!projects.length) {
            throw new Error("No projects found");
        }
        return { success: true, message: "Projects fetched successfully", data: projects.map(toPublicProject) };
    }

    async getByIdProject(id) {
        const project = await Project.findById(id).populate("domain");
        if (!project) {
            throw new Error("Project not found");
        }
        return { success: true, message: "Project fetched successfully", data: toPublicProject(project) };
    }

    async updateProject(id, data) {
        const dto = toUpdateProjectDTO(data);
        const updatedProject = await Project.findByIdAndUpdate(id, dto, { new: true });
        if (!updatedProject) {
            throw new Error("Project not found");
        }
        return { success: true, message: "Project updated successfully", data: toPublicProject(updatedProject) };
    }

    async deleteProject(id) {
        const deletedProject = await Project.findByIdAndDelete(id);
        if (!deletedProject) {
            throw new Error("Project not found");
        }
        return { success: true, message: "Project deleted successfully", data: toPublicProject(deletedProject) };
    }
}

module.exports = new ProjectService();