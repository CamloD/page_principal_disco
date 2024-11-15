import datas from 'app/data/data.json';

export function searchListings(query) {
  const lowercaseQuery = query.toLowerCase();
  return datas.listings.filter(listing =>
    listing.title.toLowerCase().includes(lowercaseQuery) ||
    listing.description.toLowerCase().includes(lowercaseQuery) ||
    listing.category.toLowerCase().includes(lowercaseQuery)
  );
}