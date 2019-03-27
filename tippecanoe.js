const config = require('config')
const { spawnSync } = require('child_process')
const groups = config.get('groups')
const keys = Object.keys(groups)
const dstDir = config.get('dstDir')

for (let key of keys) {
  const tippecanoe = spawnSync('tippecanoe', [
    '--force',
    '--simplification=2',
    `--output=${dstDir}/${key}.mbtiles`,
    '--minimum-zoom=2',
    '--maximum-zoom=15',
    '--hilbert',
    '--detect-shared-borders',
    '--detect-longitude-wraparound',
    `${dstDir}/${key}.rfc8142`
  ], { stdio: 'inherit' })
}

