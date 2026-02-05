// api/search.js
// We move the mock data here to act as a database
import { PRODUCT_DB } from '../src/data/mockData.js'; // You might need to move mockData to a shared 'lib' folder or adjust import path based on Vercel structure. 
// For simplicity in this step, copy the PRODUCT_DB constant into this file or a shared server file.

export default function handler(req, res) {
  const { query, dietMode } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }

  const cleanQuery = query.toLowerCase().trim();
  const tokens = cleanQuery.split(/\s+/).filter(t => t.length > 1);

  const results = PRODUCT_DB.filter(p => {
    const nameMatch = tokens.every(token => p.name.toLowerCase().includes(token));
    const dietMatch = dietMode === 'veg' ? p.isVeg : true;
    return nameMatch && dietMatch;
  });

  // Sort by exact match or relevance logic here if needed
  res.status(200).json(results);
}