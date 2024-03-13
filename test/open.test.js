'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { join } = require('node:path')
const { createReadStream } = require('..')

test('should fail to open a fail', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-wrong.txt')
  const stream = createReadStream(pathToFile, { autoWatch: false })

  stream.on('open', () => assert.fail('open event should not be emitted'))
  stream.on('ready', () => assert.fail('ready event should not be emitted'))

  stream.on('error', (err) => {
    assert.strictEqual(err.code, 'ENOENT')
    done()
  })
})
