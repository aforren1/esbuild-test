Setting up eslint to run on save: https://www.digitalocean.com/community/tutorials/workflow-auto-eslinting

Note that `--servedir` doesn't write the file to disk (see https://esbuild.github.io/api/#serve)

General idea is JS lives in src/, and everything else lives in public/ (so we don't bother copying over during the build step)