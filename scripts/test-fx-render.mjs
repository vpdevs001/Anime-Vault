/**
 * Standalone FX render smoke-test.
 * Imports the FX components directly (bypassing the app's font/DB-coupled root
 * layout, which can't load in this offline sandbox) and asserts each renders
 * real <img>/<Image> markup with the expected fx-* animation hooks.
 */
import { renderToStaticMarkup } from "react-dom/server";
import { createElement as h } from "react";

import { Rasengan } from "../components/fx/rasengan.tsx";
import { Sharingan } from "../components/fx/sharingan.tsx";
import { SixEyes } from "../components/fx/six-eyes.tsx";
import { CursedOrb } from "../components/fx/cursed-orb.tsx";
import { ShinigamiEye } from "../components/fx/shinigami-eye.tsx";
import { EmberField } from "../components/fx/ember-field.tsx";
import { TitanSteam } from "../components/fx/titan-steam.tsx";

const cases = [
  ["Rasengan", h(Rasengan, { size: 96 }), ["fx-rasengan-img", "fx-rasengan-aura", "img"]],
  ["Sharingan", h(Sharingan, { size: 78 }), ["fx-sharingan-img", "fx-sharingan-aura", "img"]],
  ["SixEyes", h(SixEyes, { size: 54 }), ["fx-six-eyes-img", "fx-six-eyes-aura", "img"]],
  ["CursedOrb", h(CursedOrb, { size: 44 }), ["fx-hollow-img", "fx-hollow-aura", "img"]],
  ["ShinigamiEye", h(ShinigamiEye, { size: 52 }), ["fx-shinigami-aura", "fx-shinigami-glow", "img"]],
  ["EmberField", h(EmberField, { count: 5 }), ["ember-rise", "absolute"]],
  ["TitanSteam", h(TitanSteam, { size: 64 }), ["titan-steam-wisp", "svg"]],
];

let fail = 0;
for (const [name, el, needles] of cases) {
  const html = renderToStaticMarkup(el);
  const missing = needles.filter((n) => !html.includes(n));
  const imgSrc = (html.match(/src="([^"]+)"/) || [])[1] || "(none)";
  if (missing.length) {
    console.log(`✗ ${name}: MISSING [${missing.join(", ")}]`);
    fail++;
  } else {
    console.log(`✓ ${name}  src=${imgSrc}`);
  }
  // flame palette sanity for embers
  if (name === "EmberField") {
    const cool = ["#9d5cff", "#3fc1ff", "#ff6b81"].filter((c) => html.includes(c));
    if (cool.length) { console.log(`  ✗ cool hues still present: ${cool}`); fail++; }
    else console.log(`  ✓ ember palette is fire-only (no purple/blue)`);
  }
}
console.log(fail ? `\n${fail} case(s) FAILED` : "\nAll FX components render correctly");
process.exit(fail ? 1 : 0);
