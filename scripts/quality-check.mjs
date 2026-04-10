import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const weightsPath = path.join(root, "quality", "weights.json");
const presetsDir = path.join(root, "presets");
const schemaPath = path.join(root, "tokens", "schema.json");

const responsiveByTemplate = {
  "SaaS Landing": 88,
  Portfolio: 92,
  Agency: 86,
  "E-commerce": 90,
};

const performanceByTemplate = {
  "SaaS Landing": 86,
  Portfolio: 84,
  Agency: 80,
  "E-commerce": 78,
};

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function luminance(hex) {
  const rgb = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const adjusted = rgb.map((value) =>
    value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * adjusted[0] + 0.7152 * adjusted[1] + 0.0722 * adjusted[2];
}

function contrastRatio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function consistencyScore(state) {
  const spacingSteps = new Set([4, 6, 8, 10, 12, 14, 16, 18, 20, 24]);
  let score = 100;
  if (!spacingSteps.has(state.baseSpacing)) score -= 15;
  if (state.letterSpacing < -0.5) score -= 30;
  if (state.letterSpacing > 3) score -= 10;
  if (state.borderRadius >= 20 && state.shadowIntensity === "Strong") score -= 10;
  return clamp(score);
}

function scorePreset(state, template, weights) {
  const ratio = contrastRatio(state.text, state.background);
  const accessibility = clamp((ratio / 4.5) * 100);
  const consistency = consistencyScore(state);
  const responsiveness = responsiveByTemplate[template];
  const performance = performanceByTemplate[template];

  const overall = clamp(
    accessibility * weights.accessibility +
      responsiveness * weights.responsiveness +
      consistency * weights.consistency +
      performance * weights.performance
  );

  return { accessibility, consistency, responsiveness, performance, overall, ratio };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function run() {
  const weightsData = readJson(weightsPath);
  const minimumPublishScore = Number(weightsData.minimumPublishScore);
  const weights = weightsData.weights;

  const schema = readJson(schemaPath);
  if (!schema.definitions || !schema.definitions.theme || !schema.definitions.tokenSet) {
    throw new Error("Token schema is missing required theme/tokenSet definitions.");
  }

  const presetFiles = fs
    .readdirSync(presetsDir)
    .filter((name) => name.endsWith(".json") && name !== "index.json");

  const templates = Object.keys(responsiveByTemplate);
  const failures = [];

  for (const fileName of presetFiles) {
    const preset = readJson(path.join(presetsDir, fileName));
    if (!preset.state) {
      failures.push(`Preset '${fileName}' is missing state payload.`);
      continue;
    }

    for (const template of templates) {
      const score = scorePreset(preset.state, template, weights);
      if (score.ratio < 4.5) {
        failures.push(
          `${preset.name} on ${template} fails contrast gate (${score.ratio.toFixed(2)}:1).`
        );
      }
      if (score.overall < minimumPublishScore) {
        failures.push(
          `${preset.name} on ${template} scored ${score.overall}, below threshold ${minimumPublishScore}.`
        );
      }
    }
  }

  if (failures.length > 0) {
    console.error("Quality gate failures:\n- " + failures.join("\n- "));
    process.exit(1);
  }

  console.log("Quality gate checks passed.");
}

run();
