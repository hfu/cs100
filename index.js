// throw new Error('the data are already prepared')

const config = require('config')
const modify = require(config.get('modifyPath'))
const Parser = require('json-text-sequence').parser
const fs = require('fs')

const srcPath = config.get('srcPath')
const dstDir = config.get('dstDir')
const groups = config.get('groups')
const keys = Object.keys(groups)

let outputs = {}
let count = 0
let counts = {}

const report = () => {
  console.log(`${count}: ${JSON.stringify(counts)}`)
}

for (const key of keys) {
  outputs[key] = fs.createWriteStream(`${dstDir}/${key}.rfc8142`)
  counts[key] = 0
}

const input = fs.createReadStream(srcPath)
const parser = new Parser()
  .on('data', f => {
    count++
    const k = f.properties._relation
    f = modify(f)
    if (f) {
      let written = false
      for (const key of keys) {
        if (groups[key].includes(k)) {
          const rfc8142 = `\x1e${JSON.stringify(f)}\n`
          outputs[key].write(rfc8142)
          counts[key]++
          written = true
        }
      }
      if (!written) console.log(`${k} was not written.`)
    }
    if (count % 10000 === 0) report()
  })
  .on('finish', () => {
    for (const key of keys) {
      outputs[key].close()
    }  
    report()
  })

input.pipe(parser)

