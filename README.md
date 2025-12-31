# YourBibleTracker Website

Static website for YourBibleTracker - hosted on GitHub Pages (100% free!)

## 🚀 Setup Instructions

### 1. Create GitHub Repository
1. Go to GitHub and create a new repository
2. Name it: `bibletracker-website` (or any name you prefer)
3. Make it **Public** (required for free GitHub Pages)
4. Don't initialize with README (we already have one)

### 2. Upload Files
Upload all these files to your repository:
- `index.html`
- `privacy.html`
- `terms.html`
- `feature-request.html`
- `styles.css`
- `script.js`
- `README.md`
- (Your logo image when you add it)

### 3. Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Under "Source", select `main` branch
4. Click Save
5. Your site will be live at: `https://YOUR-USERNAME.github.io/bibletracker-website/`

### 4. Custom Domain (Optional)
If you want to use `bibletracker.app`:

1. Create a file named `CNAME` (no extension) in the root
2. Add just one line: `bibletracker.app`
3. In your domain registrar (where you bought bibletracker.app):
   - Add a CNAME record pointing to: `YOUR-USERNAME.github.io`
   - Or add A records pointing to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153

### 5. Update App Store Links
Replace `YOUR-APP-ID` in these files:
- `index.html` (appears 3 times)
- `feature-request.html`
- `privacy.html`
- `terms.html`

Find your App ID in App Store Connect URL: `https://apps.apple.com/app/id123456789`

### 6. Add Your Logo
1. Upload your logo image to the repository (e.g., `logo.png`)
2. Replace the emoji in the navigation:
   ```html
   <!-- Replace this: -->
   <span class="logo-icon">📖</span>

   <!-- With this: -->
   <img src="logo.png" alt="YourBibleTracker" style="width: 32px; height: 32px;">
   ```

## 📧 Feature Request Form

The form currently shows a success message but doesn't actually send emails. To make it functional:

### Option 1: Formspree (Easiest - Free for 50 submissions/month)
1. Sign up at https://formspree.io/
2. Create a new form
3. Add this to your form tag:
   ```html
   <form action="https://formspree.io/f/YOUR-FORM-ID" method="POST">
   ```

### Option 2: EmailJS (Free for 200 emails/month)
1. Sign up at https://www.emailjs.com/
2. Follow their setup guide
3. Uncomment the EmailJS code in `script.js`

### Option 3: Google Forms
1. Create a Google Form
2. Get the form action URL
3. Update the form to post to that URL

## 🎨 Customization

### Colors
Edit `styles.css` to change theme colors:
```css
:root {
    --primary: #4F46E5;      /* Main brand color */
    --secondary: #10B981;     /* Secondary accent */
    --accent: #F59E0B;        /* Highlight color */
}
```

### Content
- Homepage: Edit `index.html`
- Privacy: Edit `privacy.html`
- Terms: Edit `terms.html`
- Feature Form: Edit `feature-request.html`

## 💰 Cost: $0
- GitHub Pages: Free
- Custom domain (bibletracker.app): ~$10-15/year (if you want it)
- Total website hosting: **FREE!** 🎉

## 📱 Mobile Responsive
The site automatically adjusts for mobile, tablet, and desktop screens.

## 🔒 HTTPS
GitHub Pages provides free SSL/HTTPS automatically - no configuration needed!

## 🌍 CDN & Speed
GitHub Pages uses a global CDN, so your site will be fast worldwide.

## Support
Questions? Email: yourbibletracker@gmail.com
