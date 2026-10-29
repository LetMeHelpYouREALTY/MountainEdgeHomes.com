/**
 * Single source of truth for NAP / GBP-aligned URLs (apex host, no www).
 * Update here when Google Business Profile office details change; then sync footers and schema.
 */
window.MountainEdgeSiteContact = {
  siteOrigin: 'https://mountainedgehomes.com',
  businessName: 'Mountain Edge Homes',
  telephoneDisplay: '(702) 919-5002',
  telephoneE164: '+17029195002',
  email: 'DrJanSells@MountainEdgeHomes.com',
  streetAddress: '8015 Blue Diamond Rd',
  addressLocality: 'Las Vegas',
  addressRegion: 'NV',
  postalCode: '89178',
  addressCountry: 'US',
  /** Google Maps search URL for the office address (matches visible Directions links). Replace with Place URL from GBP if preferred. */
  mapsSearchUrl:
    'https://www.google.com/maps/search/?api=1&query=8015+Blue+Diamond+Rd+Las+Vegas+NV+89178',
  /** Review entry point used on index; confirm in Google Business Profile. */
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ7XLw8ta5yIARjTZPjgHJWVQ',
  openingHoursNote:
    'Mon–Fri 9am–6pm, Sat 10am–4pm; Sunday by appointment (omit from schema unless GBP lists Sunday hours).',
};
