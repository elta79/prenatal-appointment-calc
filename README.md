# Prenatal Appointment Calculator

A modern, mobile-friendly web application that calculates prenatal appointment schedules based on an estimated due date.

## Features

- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Color-Coded Appointments**: Each appointment type has its own distinctive color for easy identification
- **Print Functionality**: Print-friendly layout for physical copies
- **Gestational Age Toggle**: Option to show/hide gestational age information
- **Smart Date Calculations**: Automatically calculates:
  - Estimated Due Date (40 weeks)
  - 20 Week Ultrasound
  - Glucose Test (26-28 weeks) with Friday options
  - 32 Week Appointment with Friday options
  - 36 Week Labs with Friday options
  - 37 Week Appointment with Friday options
  - Childbirth Education Class (first Saturday of month before due date)
  - Breastfeeding Class (third Thursday of month before due date)

## Tech Stack

- **Vite** - Fast build tool and development server
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **lucide-react** - Beautiful icon library

## Local Development

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository or download the files

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Deploying to Netlify

There are several ways to deploy this app to Netlify:

### Option 1: Deploy via Netlify CLI (Recommended)

1. Install the Netlify CLI globally:
```bash
npm install -g netlify-cli
```

2. Build your project:
```bash
npm run build
```

3. Deploy to Netlify:
```bash
netlify deploy
```

4. Follow the prompts:
   - Authorize with your Netlify account
   - Choose "Create & configure a new site"
   - Choose your team
   - Enter a site name (or leave blank for a random name)
   - For deploy path, enter: `dist`

5. Once successful, deploy to production:
```bash
netlify deploy --prod
```

### Option 2: Deploy via Git (GitHub, GitLab, Bitbucket)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to [Netlify](https://www.netlify.com/)

3. Click "Add new site" → "Import an existing project"

4. Connect to your Git provider and select your repository

5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Branch**: `main` (or your default branch)

6. Click "Deploy site"

Netlify will automatically build and deploy your site. Future commits to your repository will trigger automatic deployments.

### Option 3: Manual Deploy via Netlify Drop

1. Build your project:
```bash
npm run build
```

2. Go to [Netlify Drop](https://app.netlify.com/drop)

3. Drag and drop the `dist` folder onto the page

Your site will be deployed instantly!

## Configuration

The `netlify.toml` file in the root directory contains the Netlify configuration:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect rules (ensures all routes work correctly)

## Environment Variables

This app doesn't require any environment variables for basic functionality.

## Browser Support

This app works on all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.
