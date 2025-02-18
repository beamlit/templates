import { wrapFunction } from "@blaxel/sdk";

const helloWorld = () => {
  return "Hello from Blaxel";
};

export default wrapFunction(helloWorld, {
  description: "Say hello to the world from blaxel",
});
