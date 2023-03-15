import esbuild from "esbuild";
import fs from "fs";

const outputDir = "dist";

const shouldClean = process.argv.includes("--clean");

if (shouldClean) {
  // Clean up any files in the output directory, or make sure the output directory exists
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, {
      recursive: true,
      force: true,
    });
  }

  fs.mkdirSync(outputDir);
}

const sharedOptions = {
  entryPoints: ["src/index.ts"],
  sourcemap: true,
  bundle: true,
  packages: "external",
  target: "es6",
  logLevel: "info",
};

const esmOptions = {
  ...sharedOptions,
  outfile: `${outputDir}/index.mjs`,
  format: "esm",
};

const cjsOptions = {
  ...sharedOptions,
  outfile: `${outputDir}/index.cjs`,
  format: "cjs",
};

const shouldWatch = process.argv.includes("--watch");

if (shouldWatch) {
  const context = await esbuild.context(esmOptions);

  await context.watch();
  await context.serve();
} else {
  let buildTargets = ["all"];
  const buildsArgIndex = process.argv.indexOf("--builds");
  if (buildsArgIndex >= 0) {
    buildTargets = process.argv[buildsArgIndex + 1].split(",");
  }

  const builds = [];

  buildTargets.forEach((buildTarget) => {
    if (buildTarget === "esm" || buildTarget === "all") {
      builds.push(esbuild.build(esmOptions));
    }

    if (buildTarget === "cjs" || buildTarget === "all") {
      builds.push(esbuild.build(cjsOptions));
    }
  });

  if (builds.length === 0) {
    console.error("No valid builds specified for the --builds arg.");
    process.exit(1);
  }

  await Promise.all(builds);
}
