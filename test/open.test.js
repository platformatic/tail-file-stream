'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { join } = require('node:path')
const { createReadStream } = require('..')

test('should open a file', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-1.txt')
  const stream = createReadStream(pathToFile, { autoWatch: false })

  let openEmitted = false
  stream.on('open', (fd) => {
    openEmitted = true
    assert.strictEqual(typeof fd, 'number')
  })

  let readyEmitted = false
  stream.on('ready', () => {
    readyEmitted = true
  })

  setImmediate(() => {
    assert.strictEqual(openEmitted, true)
    assert.strictEqual(readyEmitted, true)
    done()
  })
})

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
