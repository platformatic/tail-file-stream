'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { appendFile } = require('node:fs/promises')
const { createReadStream } = require('..')
const { createTestFile } = require('./helper')

test('should read the file to the end after calling unwatch', (t, done) => {
  const pathToFile = createTestFile(t)
  const stream = createReadStream(pathToFile, { highWaterMark: 100 })

  let data = ''
  let expectedData = ''

  let dataEmittedAfterUnwatch = false

  stream.on('data', (chunk) => {
    data += chunk

    if (stream.watching) {
      stream.unwatch()
    } else {
      dataEmittedAfterUnwatch = true
    }
  })

  stream.on('close', () => {
    assert.strictEqual(data, expectedData)
    assert.strictEqual(dataEmittedAfterUnwatch, true)
    done()
  })

  expectedData = 'hello world 1\n'.repeat(1000)
  appendFile(pathToFile, expectedData)
})
