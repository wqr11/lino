import path from "path";

/** @type {import('vite').UserConfig} */
export default {
  resolve: {
    alias: {
      "@": path.resolve(__dirname + "/src"),
    },
  },
};
