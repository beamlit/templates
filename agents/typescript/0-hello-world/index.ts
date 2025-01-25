import { createApp, runApp } from "@beamlit/sdk";

createApp()
  .then((app) => runApp(app))
  .catch((err) => console.error(err));
