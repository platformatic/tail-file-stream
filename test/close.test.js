'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { join } = require('node:path')
const { createReadStream } = require('..')

test('should close stream with a callback', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-1.txt')
  const stream = createReadStream(pathToFile, { autoWatch: false })

  stream.close((err) => {
    assert.strictEqual(err.code, 'ERR_STREAM_PREMATURE_CLOSE')
    done()
  })
})
