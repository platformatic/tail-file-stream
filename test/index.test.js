'use strict'

const assert = require('node:assert')
const { test } = require('node:test')
const { join } = require('node:path')
const { readFile } = require('node:fs/promises')
const { createReadStream } = require('..')
const { createTestFile, appendFileWithInterval } = require('./helper')

test('should read a file without watching', (t, done) => {
  const pathToFile = join(__dirname, 'files', 'test-file-1.txt')
  const stream = createReadStream(pathToFile, { autoWatch: false })

  let data = ''
  stream.on('data', (chunk) => {
    data += chunk
  })
  stream.on('close', async () => {
    const expectedData = await readFile(pathToFile, 'utf8')
    assert.strictEqual(data, expectedData)
    done()
  })
})

test('should watch and read a file', (t, done) => {
  const pathToFile = createTestFile(t)
  const stream = createReadStream(pathToFile)

  const testData = 'hello world\n'
  const expectedData = testData.repeat(10)

  let data = ''
  stream.on('data', (chunk) => {
    data += chunk
  })

  stream.on('close', () => {
    assert.strictEqual(data, expectedData)
    done()
  })

  appendFileWithInterval(pathToFile, testData, () => {
    stream.unwatch()
  })
})
