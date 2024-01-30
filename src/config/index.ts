export const logoRedirectUrl = 'https://roadmapo.com'

// API Client URL
export const apiBaseUrl = generateApiBaseURL()
// Use to compile web-components
// export const apiBaseUrl = "https://api.roadmapo.com/v1"
function generateApiBaseURL() {
   const host = window.location.host
   const prefix = host.slice(0, 9)
   if (prefix == 'localhost')
      return "http://localhost:9000/v1"
   else return "https://api.roadmapo.com/v1"
}

// Your web app's Firebase configuration
export const firebaseConfig = {
   apiKey: "AIzaSyCPyGZ64dGSWZG5YOwDGIkIn7U0rH1QwmM",
   authDomain: "roadmapo.firebaseapp.com",
   projectId: "roadmapo",
   storageBucket: "roadmapo.appspot.com",
   messagingSenderId: "1030005719254",
   appId: "1:1030005719254:web:f61bb3fcc87e4717770977"
}

// Posthog configuration
export const posthogConfig = {
   apiKey: "phc_olnqTb1ao3iBz8UN1gzE8PUplZopoWcX8AzruDYYDaQ",
   apiHost: 'https://app.posthog.com',
};

// To load demo data for unauthorized users
export const sampleNanoid = '7Ne04xWkH5melOQRYXjYT' // sampleroadmap@gmail.com, same used in localhost
// mYAw-XPYDm_4uVYQ0z0xW // MoveMentor nanoid