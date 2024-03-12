'use strict'

const { test } = require('node:test')
const { join } = require('node:path')
const { createReadStream } = require('..')

test('should close stream with a callback', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-1.txt')
  const stream = createReadStream(pathToFile, { autoWatch: false })

  stream.on('data', () => {})
  stream.on('end', () => {
    stream.close(done)
  })
})
