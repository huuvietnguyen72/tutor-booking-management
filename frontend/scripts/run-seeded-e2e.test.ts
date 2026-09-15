import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runSeededE2e } from "../../scripts/run-seeded-e2e.mjs";

const projectRoot = path.resolve(process.cwd(), "..");

describe("runSeededE2e", () => {
  it("seeds before Playwright and restores the seed after a passing run", () => {
    const executed: string[] = [];

    runSeededE2e((step) => {
      executed.push(step);
    });

    expect(executed).toEqual(["seed", "playwright", "seed"]);
  });

  it("restores the seed before reporting a Playwright failure", () => {
    const executed: string[] = [];
    const playwrightFailure = new Error("Playwright failed");

    expect(() =>
      runSeededE2e((step) => {
        executed.push(step);
        if (step === "playwright") {
          throw playwrightFailure;
        }
      }),
    ).toThrow(playwrightFailure);

    expect(executed).toEqual(["seed", "playwright", "seed"]);
  });

  it.skipIf(process.platform !== "win32")("runs the Windows npm shim through a shell", () => {
    const temporaryDirectory = mkdtempSync(path.join(os.tmpdir(), "seeded-e2e-"));
    const callLog = path.join(temporaryDirectory, "calls.log");
    const npmShim = path.join(temporaryDirectory, "npm.cmd");

    writeFileSync(
      npmShim,
      '@echo off\r\necho %CD%^|%*>> "%E2E_CALL_LOG%"\r\nexit /b 0\r\n',
    );

    try {
      const result = spawnSync(process.execPath, [path.join(projectRoot, "scripts", "run-seeded-e2e.mjs")], {
        cwd: path.join(projectRoot, "frontend"),
        env: {
          ...process.env,
          E2E_CALL_LOG: callLog,
          PATH: `${temporaryDirectory};${process.env.PATH}`,
        },
        encoding: "utf8",
      });

      expect(result.error).toBeUndefined();
      expect(result.status).toBe(0);
      expect(readFileSync(callLog, "utf8").trim().split(/\r?\n/)).toEqual([
        `${projectRoot}|run db:seed:test`,
        `${path.join(projectRoot, "frontend")}|exec -- playwright test`,
        `${projectRoot}|run db:seed:test`,
      ]);
    } finally {
      rmSync(temporaryDirectory, { force: true, recursive: true });
    }
  });
});
