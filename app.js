/**
 * Namecheap / Passenger often uses `app.js` as the Application startup file.
 * If cPanel is set to app.js, updating only server.js will NOT change live CORS.
 * Keep this in sync — it just boots the real app.
 */
require('./server.js');
