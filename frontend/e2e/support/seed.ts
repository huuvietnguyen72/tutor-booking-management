import { execFile } from "node:child_process";
import { resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(__dirname, "../../..");

export async function restoreTestSeed(): Promise<void> {
  await execFileAsync(
    "powershell.exe",
    [
      "-NoProfile",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      "scripts\\seed-test-data.ps1",
    ],
    {
      cwd: repositoryRoot,
      env: { ...process.env, SPRING_PROFILES_ACTIVE: "local" },
    },
  );
}
