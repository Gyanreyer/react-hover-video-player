import esbuild from 'esbuild';

const context = await esbuild.context({
  entryPoints: ['dev/index.tsx'],
  outfile: 'dev/build/index.js',
  sourcemap: true,
  bundle: true,
  target: 'es6',
  logLevel: 'info',
});

await context.watch();
await context.serve({
  servedir: 'dev',
  port: 8080,
});
