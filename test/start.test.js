'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { join } = require('node:path')
const { readFile } = require('node:fs/promises')
const { createReadStream } = require('..')
const { createTestFile, appendFileWithInterval } = require('./helper')

test('should read a file from a starting position', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-1.txt')
  const stream = createReadStream(pathToFile, { autoWatch: false, start: 3 })

  let data = ''
  stream.on('data', (chunk) => {
    data += chunk
  })
  stream.on('close', async () => {
    const expectedData = await readFile(pathToFile, 'utf8')
    assert.strictEqual(data, expectedData.slice(3))
    done()
  })
})

test('should read an appended data from a starting position', (t, done) => {
  const pathToFile = createTestFile(t)
  const stream = createReadStream(pathToFile, { start: 42 })

  const testData = 'hello world\n'
  const expectedData = testData.repeat(10)

  let data = ''
  stream.on('data', (chunk) => {
    data += chunk
  })
  stream.on('close', async () => {
    assert.strictEqual(data, expectedData.slice(42))
    done()
  })

  appendFileWithInterval(pathToFile, testData, () => {
    stream.unwatch()
  })
})
