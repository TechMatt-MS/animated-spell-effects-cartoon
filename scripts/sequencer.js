import { cartoonDatabase } from "./database.js";
import { MODULE_ID } from "./constants.js";

/**
 * Register the curated effect catalogue with the Sequencer Database so that
 * Automated Animations, the Sequencer Effect Player, and Sequencer-based macros
 * can reference the effects via the `animated-spell-effects-cartoon.*` namespace.
 */
export function registerWithSequencer() {
  const seq = globalThis.Sequencer;
  if (!seq?.Database?.registerEntries) return;
  if (seq.Database.entries?.[MODULE_ID]) return;

  try {
    seq.Database.registerEntries(MODULE_ID, cartoonDatabase);
    console.log(`${MODULE_ID} | Registered effects with the Sequencer Database.`);
  } catch (err) {
    console.error(`${MODULE_ID} | Failed to register Sequencer Database entries.`, err);
  }
}

/**
 * Append one flattened effect entry to the accumulator.
 *
 * @param {Array<object>} out
 * @param {string[]} segments  Database path segments leading to this file.
 * @param {string} file        The file path.
 * @param {number} [variant]   1-based variant index when the leaf is an array.
 */
function pushEffect(out, segments, file, variant) {
  const category = (segments[0] ?? "misc").toUpperCase();
  const rest = segments.slice(1).join(" ");
  const base = rest || segments[0] || "effect";
  const name = variant ? `${base} ${String(variant).padStart(2, "0")}` : base;
  out.push({
    file,
    path: segments.join("."),
    category,
    name,
    label: `${category} - ${name}`,
  });
}

/**
 * Flatten the curated Sequencer Database tree into a flat list of effect
 * entries for the browser. Array leaves (random-pick variants) are expanded
 * into one entry per file so each can be placed individually.
 *
 * @returns {Array<{file: string, path: string, category: string, name: string, label: string}>}
 */
export function flattenEffects() {
  const out = [];
  (function walk(node, segments) {
    if (typeof node === "string") {
      pushEffect(out, segments, node);
    } else if (Array.isArray(node)) {
      node.forEach((file, i) => {
        if (typeof file === "string") pushEffect(out, segments, file, i + 1);
      });
    } else if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) walk(value, [...segments, key]);
    }
  })(cartoonDatabase, []);
  return out;
}
