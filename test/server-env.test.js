const test = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

test("server exits with a clear error when MONGODB_URI is missing", () => {
  const serverPath = path.join(__dirname, "..", "src", "server.js");

  const result = spawnSync(process.execPath, [serverPath], {
    cwd: path.join(__dirname, ".."),
    env: { ...process.env, MONGODB_URI: "" },
    encoding: "utf8",
    timeout: 2000,
  });

  assert.notEqual(result.status, 0);
  assert.match(
    `${result.stdout}\n${result.stderr}`,
    /MONGODB_URI environment variable is required/
  );
});