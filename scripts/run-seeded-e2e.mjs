import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const frontendRoot = path.join(projectRoot, "frontend");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function executeStep(step) {
  const isSeed = step === "seed";
  const result = spawnSync(
    npmCommand,
    isSeed ? ["run", "db:seed:test"] : ["exec", "--", "playwright", "test"],
    {
      cwd: isSeed ? projectRoot : frontendRoot,
      env: process.env,
      shell: process.platform === "win32",
      stdio: "inherit",
    },
  );

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${isSeed ? "db:seed:test" : "playwright test"} exited with code ${result.status}`);
  }
}

export function runSeededE2e(execute = executeStep) {
  execute("seed");

  let playwrightFailure;
  try {
    execute("playwright");
  } catch (error) {
    playwrightFailure = error;
  }

  let restoreFailure;
  try {
    execute("seed");
  } catch (error) {
    restoreFailure = error;
  }

  if (playwrightFailure) {
    if (restoreFailure) {
      console.error("db:seed:test failed while restoring the database:", restoreFailure);
    }
    throw playwrightFailure;
  }
  if (restoreFailure) {
    throw restoreFailure;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runSeededE2e();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}
