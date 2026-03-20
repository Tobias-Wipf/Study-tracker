# Studytracker

A lean, intuitive study progress tracker built for university students. Track your learning progress, manage tasks, and keep exam dates in sight — all in one place, synced across all your devices.

**[study-tracker.org](https://study-tracker.org)**

## Features

- **Progress Tracking** — Track learning progress per subject, topic, and study category with 4 status levels (Not started, In progress, Review, Done)
- **Progress Charts** — Interactive charts showing your improvement over days and weeks
- **To-Do List** — Tasks with priority, due dates, and subject assignment
- **Daily Goal** — Set daily study targets with the Daily Dopamine Boost
- **Exam Countdown** — Color-coded countdown showing days until each exam
- **Templates** — Share subject structures with classmates or import ready-made templates (including from Excel files and images via OCR)
- **Cloud Sync** — Automatic sync via Firebase across all devices with offline support
- **Bilingual** — Full German and English support
- **PWA** — Installable as an app on iPhone with full-screen mode and offline access
- **Mobile UI** — Separate native iOS-style interface with bottom tab bar, swipe gestures, and touch-optimized interactions

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Database | Firebase Firestore |
| Auth | Firebase Authentication (Google OAuth) |
| Hosting | Firebase Hosting |
| Mobile | Capacitor (iOS), PWA |
| Import | SheetJS (Excel), Tesseract.js (OCR) |

No frameworks. No build step. Just fast, simple code.

## Getting Started

### Prerequisites

- A Google account (for authentication)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for development/deployment)
- Node.js (for Capacitor iOS builds)

### Setup

```bash
# Clone the repository
git clone https://github.com/Tobias-Wipf/study-tracker.git
cd study-tracker

# Install dependencies (for Capacitor only)
npm install

# Start local development
firebase serve
```

### Firebase Configuration

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google provider)
3. Create a Firestore database
4. Update the Firebase config in `app.js` with your project credentials
5. Deploy Firestore rules: `firebase deploy --only firestore`
6. Deploy hosting: `firebase deploy --only hosting`

### iOS Build (Capacitor)

```bash
npx cap sync ios
npx cap open ios
```

## Project Structure

```
study-tracker/
  index.html          # Landing page + main app shell
  app.js              # Core application logic & Firebase integration
  style.css           # Global styles & design system
  mobile.js           # Mobile-specific UI (iOS-style layout)
  mobile.css          # Mobile-specific styles
  i18n.js             # Internationalization (DE/EN)
  presets.js           # Template/preset management
  sw.js               # Service worker (offline support & caching)
  features.html       # Features page
  about.html          # About page & team
  impressum.html      # Legal/imprint
  manifest.json       # PWA manifest
  firebase.json       # Firebase hosting & security headers
  firestore.rules     # Firestore security rules
  capacitor.config.json  # iOS app configuration
```

## Architecture

Studytracker is intentionally built without frameworks — just vanilla HTML, CSS, and JavaScript. All data is stored in `localStorage` for instant access and synced to Firebase Firestore in the background.

**Key design decisions:**
- **No build step** — edit and deploy directly
- **Network-first caching** — always fetch fresh code, fall back to cache offline
- **Separate mobile UI** — desktop and mobile render completely different layouts from the same data layer
- **Admin approval** — user-submitted templates require admin review before appearing in the library

## Contributing

Contributions are welcome! Whether it's bug fixes, new features, or translations.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Team

Built by two BWL students in the Assessment Year at the University of St. Gallen (HSG):

- **Tobias Wipf** — [LinkedIn](https://www.linkedin.com/in/tobias-wipf-5b255a216/) | [GitHub](https://github.com/Tobias-Wipf)
- **Tomas Alvarez** — [LinkedIn](https://www.linkedin.com/in/tom%C3%A1s-alvarez/) | [GitHub](https://github.com/tomasalvareezz)

## License

This project is licensed under the ISC License — see the [LICENSE](LICENSE) file for details.

## Contact

study.tracker.info@gmail.com
