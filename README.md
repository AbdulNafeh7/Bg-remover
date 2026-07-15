# Image Background Remover

A simple, clean web application for removing image backgrounds using the remove.bg API. No unnecessary features - just straightforward background removal.
Test Link: https://github.io/AbdulNafeh7/Bg-remover/
## Features

- Simple and clean user interface for quick background removal
- Drag and drop functionality for easy image upload
- Secure API key storage in browser LocalStorage
- Fast processing using remove.bg API
- Easy download of processed PNG images with transparent backgrounds
- Fully responsive design for desktop, tablet, and mobile devices
- No bloat, no unnecessary features

## How to Use

1. Get Your API Key
   - Visit remove.bg/api
   - Sign up for a free account
   - Copy your API key

2. Add Your API Key
   - Paste your API key in the API Configuration section
   - Click Save API Key
   - Your key is saved locally in your browser

3. Upload an Image
   - Drag and drop an image onto the upload area, or click to browse
   - The app will automatically process your image
   - Wait for processing to complete

4. Download Your Image
   - Click Download to save the image with the background removed
   - Use Reset to process another image

## File Structure

- index.html - HTML structure
- styles.css - Styling and responsive design
- script.js - JavaScript functionality
- README.md - Documentation

## Technical Details

- Frontend: Pure HTML, CSS, and JavaScript (no frameworks)
- API: remove.bg REST API v1.0
- Storage: LocalStorage for API key management
- Format: Outputs PNG images with transparent backgrounds

## API Key Storage

Your API key is stored in your browser's LocalStorage and never sent to any server other than remove.bg's official API endpoint. You have full control over your data.

## Supported Image Formats

- JPEG
- PNG
- WebP
- BMP
- GIF

## File Size Limit

Maximum file size: 10MB

## Error Handling

The app provides clear error messages for:
- Missing or invalid API key
- API quota exceeded
- Invalid image format
- Connection issues

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - Feel free to use and modify

## Support

For issues with the remove.bg API, visit their documentation at remove.bg/api

---

Made with care | Powered by remove.bg
