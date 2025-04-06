# Mountain Edge Homes Website

Welcome to the Mountain Edge Homes website repository! This wiki provides information about the project structure, key features, and how to contribute.

## Overview

Mountain Edge Homes is a real estate website specializing in properties in the Mountain's Edge community of Las Vegas (89178). The site showcases luxury homes, neighborhood information, and provides tools for homebuyers and sellers.

## Features

- **Property Search**: Advanced search functionality for Mountain's Edge homes
- **Interactive Maps**: Google Maps integration showing neighborhoods and points of interest
- **Neighborhood Profiles**: Detailed information about each neighborhood in Mountain's Edge
- **Agent Profiles**: Team information with contact details
- **Scheduling System**: Calendly integration for booking showings and consultations
- **Responsive Design**: Mobile-friendly interface that works on all devices

## Project Structure

- `index.html` - Main homepage with property search and featured listings
- `assets/` - Contains all CSS, JavaScript, and image files
- `neighborhood-*.html` - Individual neighborhood pages
- Various supporting pages (team, testimonials, blog, etc.)

## Environment Setup

The website requires the following environment variables:
- `GOOGLE_MAPS_API_KEY` - API key for Google Maps integration

## Local Development

To run the site locally:

```
npm install
npm start
```

The site will be available at http://localhost:3000

## Automatic Git Push from Replit

This project includes an automatic Git push system that synchronizes changes from Replit to GitHub:

- **Auto-Push Service**: When running in Replit, changes are automatically committed and pushed to GitHub
- **Frequency**: Changes are checked every 2 minutes and pushed at most every 5 minutes
- **Service Control**: 
  - To start: Run `bash start-auto-push.sh`
  - To stop: Run `bash stop-auto-push.sh`
- **Log File**: Auto-push activity is logged to `auto-push.log`

The service starts automatically when you run the project in Replit, ensuring all changes are continuously backed up to GitHub without manual intervention.

## Deployment

The site is deployed using Replit's built-in deployment tools.

## Contributing

1. Create a new branch for your feature
2. Make your changes and test locally
3. Submit a pull request with a clear description of the changes

## Security Notes

- API keys are stored as environment variables
- No sensitive data is stored in the codebase

## License

This project is licensed under the MIT License - see the LICENSE file for details.
