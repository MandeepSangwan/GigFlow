import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Parser } from 'json2csv';
import Lead from '../models/Lead';

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { name, email, status, source } = req.body;

    const newLead = new Lead({ name, email, status, source });
    const savedLead = await newLead.save();

    res.status(201).json(savedLead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, search = '', status, source, sort = 'Latest' } = req.query;
    const limit = 10;
    const skip = (Number(page) - 1) * limit;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) query.status = status;
    if (source) query.source = source;

    const sortOption: any = sort === 'Oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: leads,
      meta: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    res.status(200).json(lead);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const exportLeadsCsv = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search = '', status, source, sort = 'Latest' } = req.query;
    
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) query.status = status;
    if (source) query.source = source;

    const sortOption: any = sort === 'Oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const leads = await Lead.find(query).sort(sortOption).lean();

    const fields = ['_id', 'name', 'email', 'status', 'source', 'createdAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(leads);

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.status(200).send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
