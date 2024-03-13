'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { join } = require('node:path')
const { close } = require('node:fs')
const { createReadStream } = require('..')

test('should emit a read error', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-1.txt')
  const stream = createReadStream(pathToFile, { highWaterMark: 10 })

  let error = null
  stream.on('error', (err) => { error = err })
  stream.on('open', close)

  stream.on('close', () => {
    assert.strictEqual(error.code, 'EBADF')
    done()
  })

  stream.read()
})
