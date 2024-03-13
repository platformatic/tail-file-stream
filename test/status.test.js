'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { join } = require('node:path')
const { createReadStream } = require('..')

test('stream statuses while reading', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-1.txt')
  const stream = createReadStream(pathToFile)

  assert.strictEqual(stream.pending, true)
  assert.strictEqual(stream.waiting, false)
  assert.strictEqual(stream.watching, false)
  assert.strictEqual(stream.closed, false)
  assert.strictEqual(stream.destroyed, false)

  stream.on('data', () => {
    assert.strictEqual(stream.pending, false)
    assert.strictEqual(stream.waiting, false)
    assert.strictEqual(stream.watching, true)
    assert.strictEqual(stream.closed, false)
    assert.strictEqual(stream.destroyed, false)
  })

  stream.on('eof', () => {
    assert.strictEqual(stream.pending, false)
    assert.strictEqual(stream.waiting, true)
    assert.strictEqual(stream.watching, true)
    assert.strictEqual(stream.closed, false)
    assert.strictEqual(stream.destroyed, false)
    stream.unwatch()
  })

  stream.on('end', () => {
    assert.strictEqual(stream.pending, false)
    assert.strictEqual(stream.waiting, false)
    assert.strictEqual(stream.watching, false)
    assert.strictEqual(stream.closed, false)
    assert.strictEqual(stream.destroyed, false)
    stream.unwatch()
  })

  stream.on('close', () => {
    assert.strictEqual(stream.pending, true)
    assert.strictEqual(stream.waiting, false)
    assert.strictEqual(stream.watching, false)
    assert.strictEqual(stream.closed, true)
    assert.strictEqual(stream.destroyed, true)
    done()
  })
})
