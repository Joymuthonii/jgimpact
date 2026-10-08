# JG Impact - Mental Health & Rehabilitation Facility Website

A modern, production-ready Next.js web application for JG Impact mental health and rehabilitation facility in Juja, Kenya.

## Overview

This application provides:

- Professional landing page showcasing facility services
- Interactive step-by-step appointment booking system
- Facility gallery and tour
- Contact information and embedded map
- Mobile-responsive design
- Accessibility-first approach
- Form validation and error handling
- Floating WhatsApp contact button

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **UI Components:** Lucide React Icons
- **Form Handling:** React Hook Form + Zod validation
- **Database:** Ready for Supabase integration

## Project Structure

```
jg-impact-web/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       ├── Navigation.tsx
│       ├── Hero.tsx
│       ├── Services.tsx
│       ├── FacilityGallery.tsx
│       ├── BookingModal.tsx
│       ├── Contact.tsx
│       ├── Footer.tsx
│       └── FloatingWhatsApp.tsx
├── public/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Design System

### Color Palette

- **Primary Navy:** `#102E69` - Headers, navigation, primary text
- **Secondary Green:** `#3BA76C` - Interactive elements, buttons
- **Accent Gold:** `#C6943C` - Highlights, badges
- **Canvas:** `#F8FAF8` - Section backgrounds
- **Text:** `#172033` - Body text
- **Border:** `#E2E8F0` - Dividers

### Typography

- **Font Family:** Inter (system fallback)
- **H1 Desktop:** 52px, Weight 700
- **H2 Desktop:** 36px, Weight 600
- **Body Desktop:** 16px, Weight 400

## Features

### 1. Navigation Bar

Fixed top bar with:
- Logo and branding
- Navigation links (Home, Services, Facility, Contact)
- Direct phone call link
- Book Appointment CTA
- Mobile hamburger menu

### 2. Hero Section

Two-column layout featuring:
- Professional badge
- Main headline and description
- Dual CTA buttons (Request Appointment, View Facility)
- Quick contact phone strip
- Facility image placeholder

### 3. Services Grid

12-service feature grid with:
- Lucide React icons
- Hover effects
- Responsive 3→2→1 column layout
- Clean card design

### 4. Facility Gallery

Photo gallery with:
- 4-image grid (4:3 aspect ratio)
- Lightbox viewer on click
- Responsive layout

### 5. Booking System

Multi-step modal with:
- **Step 1:** Service selection (radio buttons)
- **Step 2:** Date picker + time slots
- **Step 3:** Contact info + session type
- **Step 4:** Confirmation screen

Form validation with React Hook Form.

### 6. Contact Section

Two-column layout:
- **Left:** Location, phone, email cards
- **Right:** Embedded Google Map
- All contact links are functional

### 7. Footer

Navy background with:
- Company info & address
- Quick navigation links
- Contact & emergency info
- Legal/confidentiality notice
- Admin portal link
- Copyright notice

### 8. Floating WhatsApp Button

Fixed bottom-right button with:
- WhatsApp icon
- Links to: `https://wa.me/254703653555`
- Pre-filled message
- Shadow and hover effects

## Getting Started

### Prerequisites

- Node.js 16+ or 18+
- npm or yarn

### Installation

1. Extract the project files
2. Navigate to project directory:
   ```bash
   cd jg-impact-web
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Customization

### Update Contact Information

Edit `src/components/Contact.tsx`, `src/components/Navigation.tsx`, and `src/components/Footer.tsx`:

```typescript
// Update phone numbers
href="tel:YOUR_PHONE_NUMBER"

// Update email
href="mailto:YOUR_EMAIL"

// Update WhatsApp number in FloatingWhatsApp.tsx
whatsappUrl = `https://wa.me/YOUR_PHONE_NUMBER`
```

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  'brand-navy': '#YOUR_COLOR',
  'brand-green': '#YOUR_COLOR',
  // ... etc
}
```

### Update Services List

Edit `src/components/Services.tsx`:

```typescript
const SERVICES = [
  // Add/remove services here
]
```

### Add Facility Images

1. Place images in `public/` folder
2. Update `src/components/FacilityGallery.tsx` to reference image paths
3. Replace placeholder `<div>` with actual `<Image>` component

### Enable Database Integration

For appointment storage:

1. Set up Supabase project
2. Create `appointments` table
3. Configure environment variables in `.env.local`
4. Update `BookingModal.tsx` submission handler

## Deployment

### Vercel (Recommended)

1. Push to GitHub repository
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Works with any Node.js hosting (Heroku, Railway, etc.)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Performance

- Mobile-first responsive design
- Optimized images
- CSS-in-JS with Tailwind
- Fast page loads
- SEO-friendly structure

## Environment Variables

Create `.env.local`:

```
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_google_maps_api_key
NEXT_PUBLIC_FACILITY_PHONE=0703653555
NEXT_PUBLIC_FACILITY_PHONE_2=0702492050
```

## Support & Maintenance

For updates, modifications, or deployments:

1. Keep Next.js and dependencies updated
2. Test responsive design on mobile/tablet
3. Verify all contact links work
4. Update service offerings as needed
5. Monitor form submissions
6. Regular security audits

## License

© 2026 JG Impact Ltd. All rights reserved.

## Contact

**JG Impact - Mental Health & Rehabilitation Facility**

Location: Kenyatta Road, Juja, Behind Muigai Inn, Kiambu County, Kenya

Phone: 0703 653 555 | 0702 492 050

Email: journeygimpact@gmail.com

WhatsApp: https://wa.me/254703653555
