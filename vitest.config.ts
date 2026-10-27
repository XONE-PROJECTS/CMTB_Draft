import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: "@/inquiries", replacement: path.resolve(root, "src/lib/inquiries") },
      { find: "@/contact", replacement: path.resolve(root, "src/lib/contact") },
      { find: /^@\/(.*)$/, replacement: `${path.resolve(root, "src")}/$1` },
    ],
  },
  test: { environment: "node" },
});
