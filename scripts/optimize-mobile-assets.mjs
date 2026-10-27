import { spawnSync } from "node:child_process";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const names = ["civic-steps", "provider-places", "saada-paralegal"];
function run(args) {
  const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", ...args], { encoding: "utf8" });
  if (result.error || result.status !== 0) throw new Error(result.stderr || result.error?.message || "ffmpeg failed");
  return result.stdout.trim();
}
for (const name of names) {
  const input = path.join(root, "mobile/assets", `${name}.png`);
  const output = path.join(root, "mobile/assets", `${name}.webp`);
  run(["-y", "-i", input, "-c:v", "libwebp", "-lossless", "1", "-compression_level", "6", "-pix_fmt", "bgra", output]);
  const pixels = file => {
    const result = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-i", file, "-f", "rawvideo", "-pix_fmt", "rgba", "-"], { maxBuffer: 32 * 1024 * 1024 });
    if (result.error || result.status !== 0) throw new Error(`Cannot decode ${file}`);
    return result.stdout;
  };
  const original = pixels(input), optimized = pixels(output);
  if (original.length !== optimized.length) throw new Error(`${name}: dimensions changed`);
  // RGB values hidden by zero alpha may differ; every visible channel and alpha must match.
  for (let i = 0; i < original.length; i += 4) {
    if (original[i + 3] !== optimized[i + 3] || (original[i + 3] > 0 && !original.subarray(i, i + 3).equals(optimized.subarray(i, i + 3)))) throw new Error(`${name}: visible pixels changed`);
  }
  const before = statSync(input).size;
  const after = statSync(output).size;
  if (after >= before) throw new Error(`${name}: optimized file is not smaller`);
  console.log(`${name}: ${before} -> ${after} bytes; ${Math.round((1 - after / before) * 100)}% saved; visible pixels and alpha identical`);
}
