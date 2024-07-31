import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "../package.json";

const { version, name } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch] = version.replace(/[^\d.-]+/g, "").split(/[.-]/);

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: "Quantum Tic Tac Toe",
  version: `${major}.${minor}.${patch}`,
  version_name: version,
  description:
    "",
    "permissions": [],
  background: {
    service_worker: "src/pages/background/service-worker.js",
  },
  action: {
    
  },

  icons: {
    "128": "src/assets/logo.png",
  }
}));
