import { wrapFunction } from "@beamlit/sdk";

const helloWorld = () => {
  return "Hello from Beamlit";
};


export default wrapFunction(helloWorld, {
  description: "Say hello to the world from beamlit"
});

