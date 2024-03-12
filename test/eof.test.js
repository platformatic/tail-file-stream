'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { createReadStream } = require('..')
const { createTestFile, appendFileWithInterval } = require('./helper')

test('should emit eof event every time it reaches the end', (t, done) => {
  const pathToFile = createTestFile(t)
  const stream = createReadStream(pathToFile)

  const testData = 'hello world\n'
  const expectedData = testData.repeat(10)

  let data = ''
  let count = 0

  stream.on('data', (chunk) => {
    data += chunk
  })

  stream.on('eof', () => {
    assert.strictEqual(data, testData.repeat(count++))
  })

  stream.on('close', () => {
    assert.strictEqual(data, expectedData)
    assert.strictEqual(count, 11)
    done()
  })

  appendFileWithInterval(pathToFile, testData, () => {
    stream.unwatch()
  })
})
