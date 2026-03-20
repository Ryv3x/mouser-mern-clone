import Sponsor from '../models/Sponsor.js';

export const getSponsors = async (req, res) => {
  const sponsors = await Sponsor.find();
  res.json(sponsors);
};

export const createSponsor = async (req, res) => {
  const sponsor = new Sponsor(req.body);
  const created = await sponsor.save();
  res.status(201).json(created);
};

export const updateSponsor = async (req, res) => {
  const sponsor = await Sponsor.findById(req.params.id);
  if (sponsor) {
    Object.assign(sponsor, req.body);
    const updated = await sponsor.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Sponsor not found' });
  }
};

export const deleteSponsor = async (req, res) => {
  const sponsor = await Sponsor.findById(req.params.id);
  if (sponsor) {
    await sponsor.remove();
    res.json({ message: 'Sponsor removed' });
  } else {
    res.status(404).json({ message: 'Sponsor not found' });
  }
};

// admin-only: remove all sponsors
export const clearSponsors = async (req, res) => {
  await Sponsor.deleteMany({});
  res.json({ message: 'All sponsors cleared' });
};
