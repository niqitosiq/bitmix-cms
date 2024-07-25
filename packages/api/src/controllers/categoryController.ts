import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class CategoryController {
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await prisma.category.findMany();
      res.json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const category = await prisma.category.findUnique({
        where: { id: parseInt(id) },
      });
      if (category) {
        res.json(category);
      } else {
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async createCategory(req: Request, res: Response) {
    const { name } = req.body;
    try {
      const category = await prisma.category.create({
        data: { name },
      });
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const category = await prisma.category.update({
        where: { id: parseInt(id) },
        data: { name },
      });
      res.json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.category.delete({
        where: { id: parseInt(id) },
      });
      res.json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}