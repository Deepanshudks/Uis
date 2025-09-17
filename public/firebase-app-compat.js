importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"
);

const firebase = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage((req) => {
  console.log("[firebase-messaging-sw.js] Received background message ", req);

  const notificationTitle = req.notification.title;
  const notificationOptions = {
    body: req.notification.body,
    icon: "/hello.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
