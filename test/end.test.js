'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { join } = require('node:path')
const { readFile } = require('node:fs/promises')
const { createReadStream } = require('..')
const { createTestFile, appendFileWithInterval } = require('./helper')

test('should read a file before an end position', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-1.txt')
  const stream = createReadStream(pathToFile, { autoWatch: false, end: 5 })

  let data = ''
  stream.on('data', (chunk) => {
    data += chunk
  })
  stream.on('close', async () => {
    const expectedData = await readFile(pathToFile, 'utf8')
    assert.strictEqual(data, expectedData.slice(0, 6))
    done()
  })
})

test('should read an appended data before an end position', (t, done) => {
  const pathToFile = createTestFile(t)
  const stream = createReadStream(pathToFile, { end: 12 })

  const testData = 'hello world\n'
  const expectedData = testData.repeat(10)

  let data = ''
  stream.on('data', (chunk) => {
    data += chunk
  })
  stream.on('close', async () => {
    assert.strictEqual(data, expectedData.slice(0, 13))
    done()
  })

  appendFileWithInterval(pathToFile, testData)
})
