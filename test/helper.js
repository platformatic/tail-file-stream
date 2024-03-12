'use strict'

const { tmpdir } = require('node:os')
const { join } = require('node:path')
const { randomUUID } = require('node:crypto')
const { writeFileSync } = require('node:fs')
const { appendFile, rm } = require('node:fs/promises')

function createTestFile (t) {
  const fileName = 'fail-fail-stream-test-' + randomUUID()
  const filePath = join(tmpdir(), fileName)

  writeFileSync(filePath, '')
  t.after(() => rm(filePath))

  return filePath
}

function appendFileWithInterval (path, data, options = {}, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }

  const times = options.times ?? 10
  const timeout = options.timeout ?? 100

  let count = 0

  const interval = setInterval(() => {
    if (count++ >= times) {
      clearInterval(interval)
      callback()
    }
    appendFile(path, data).catch((err) => {
      clearInterval(interval)
      callback(err)
    })
  }, timeout).unref()
}

module.exports = {
  createTestFile,
  appendFileWithInterval
}
