'use strict'

const { Readable, finished } = require('node:stream')
const fs = require('node:fs')

const ioDone = Symbol('ioDone')

class TailFileStream extends Readable {
  #watching = false
  #waiting = false
  #performingIO = false

  #start
  #end
  #pos
  #flags
  #mode
  #fd

  #autoWatch
  #persistent

  constructor (path, options = {}) {
    if (options.highWaterMark === undefined) {
      options.highWaterMark = 64 * 1024
    }

    super(options)

    this.path = path
    this.#flags = options.flags ?? 'r'
    this.#mode = options.mode ?? 0o666

    this.#start = options.start ?? 0
    this.#end = options.end ?? Infinity
    this.#pos = this.#start
    this.bytesRead = 0

    this.#autoWatch = options.autoWatch ?? true
    this.#persistent = options.persistent ?? true

    this.#fd = null
    this.watcher = null
  }

  get pending () {
    return this.#fd === null
  }

  get watching () {
    return this.#watching
  }

  get waiting () {
    return this.#waiting
  }

  _construct (cb) {
    if (this.#autoWatch) {
      this.watch()
    }

    fs.open(this.path, this.#flags, this.#mode, (err, fd) => {
      if (err) {
        cb(err)
      } else {
        this.#fd = fd
        cb()
        this.emit('open', this.#fd)
        this.emit('ready')
      }
    })
  }

  _read (n) {
    n = Math.min(this.#end - this.#pos + 1, n)

    if (n <= 0) {
      this.push(null)
      return
    }

    const buf = Buffer.allocUnsafeSlow(n)

    this.#performingIO = true
    fs.read(this.#fd, buf, 0, n, this.#pos, (err, bytesRead, buf) => {
      this.#performingIO = false

      /* c8 ignore next 4 */
      if (this.destroyed) {
        this.emit(ioDone, err)
        return
      }

      if (err) {
        this.emit('error', err)
        this.destroy(err)
        return
      }

      if (bytesRead === 0) {
        if (this.#watching) {
          this.#waiting = true
          this.watcher.once('change', () => {
            this.#waiting = false
            this._read(n)
          })
        } else {
          this.push(null)
        }
        this.emit('eof')
        return
      }

      this.#pos += bytesRead
      this.bytesRead += bytesRead

      if (bytesRead !== buf.length) {
        const dst = Buffer.allocUnsafeSlow(bytesRead)
        buf.copy(dst, 0, 0, bytesRead)
        buf = dst
      }

      this.push(buf)
    })
  }

  watch () {
    this.#watching = true

    if (!this.watcher) {
      this.watcher = fs.watch(this.path, {
        persistent: this.#persistent
      })
    }
  }

  unwatch () {
    this.#autoWatch = false
    this.#watching = false

    if (this.watcher) {
      this.watcher.close()
      this.watcher = null
    }

    if (this.#waiting) {
      this.#waiting = false
      this.push(null)
    }
  }

  _destroy (err, cb) {
    /* c8 ignore next 3 */
    if (this.#performingIO) {
      this.once(ioDone, (er) => this.#close(err || er, cb))
    } else {
      this.#close(err, cb)
    }
  }

  close (cb) {
    if (typeof cb === 'function') finished(this, cb)
    this.destroy()
  }

  #close (err, cb) {
    this.unwatch()

    if (this.#fd) {
      fs.close(this.#fd, (er) => cb(er || err))
      this.#fd = null
    } else {
      cb(err)
    }
  }
}

function createReadStream (path, options) {
  return new TailFileStream(path, options)
}

module.exports = {
  createReadStream
}
