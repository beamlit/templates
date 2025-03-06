import { wrapFunction } from "@blaxel/sdk";

const helloworld = () => {
  return "Hello from Blaxel";
};

export default wrapFunction(helloworld, {
  description: "Say hello to the world from blaxel",
});