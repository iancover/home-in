# [Home In](https://home-in.vercel.app)

[![vercel logo](/src/assets/images/vercel-btn.png)](https://home-in.vercel.app)

A mobile first [React](https://reactjs.org/docs/getting-started.html) app built on [Firebase](https://firebase.google.com/) using [Firestore](https://firebase.google.com/docs/firestore) to build the **_noSQL_** database and deployed to [Vercel](https://home-in.vercel.app). It is a real-estate marketplace where property owners, home buyers and renters can search or list properties for sale or lease.

---

## Dependencies

- [Geocoding API](https://developers.google.com/maps/documentation/geocoding/) a [Google Maps Platform](https://mapsplatform.google.com/) tool for getting addresses's latitude and longitude coordinates.
- [LeafletJS](https://leafletjs.com/index.html) a _JavaScript_ library which uses the _geolocation_ coordinates to view a location on an embedded interactive map.
- [React Leaflet](https://react-leaflet.js.org/) a plugin for integrating the mapping library with _React_.
- [SwiperJS](https://swiperjs.com/react) a styling slider-component library to display images with customizable transitions.
- [React Toastify](https://fkhadra.github.io/react-toastify/installation/) a _React_ library for styling user-triggered notifications.

---

### Run Scripts

To run the app in _development_ mode which runs on [PORT: 3000](http://localhost:3000) by default, on the terminal in the project's root folder run

```sh
npm start
```

and open your browser [http://localhost:3000](http://localhost:3000) to view the app.

Or to run in production which bundles the app in a `/build` folder run

```sh
npm run build
```

and see additional info for [deployment](https://facebook.github.io/create-react-app/docs/deployment)
