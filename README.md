# tail-file-stream

__tail-file-stream__ is a library that provides a streaming interface for reading a file that can be appended.
It implements the Node.js fs.ReadStream functionality and watches the file for changes.
When the file is appended, the stream emits a 'data' event with the new data.

- [Install](#install)
- [Usage](#usage)
- [API](#api)
  - [createReadStream(path, [options])](#createreadstreampath-options)
  - [TailFileStream](#tailfilestream)
- [License](#license)

<a name="install"></a>

## Install

```
npm i tail-file-stream --save
```

<a name="usage"></a>

## Usage

```js
const { createReadStream } = require('tail-file-stream')

const stream = createReadStream('./foo.txt')

stream.on('data', (chunk) => {
  // Emits when has new data
})
stream.on('eof', () => {
  // Emits when reaches the end of the file
})
stream.on('end', () => {
  // Emits when stream ends
})

setTimeout(() => {
  // Stop watching the file
  stream.unwatch()
}, 10000)

```

<a name="api"></a>

## API

<a name="create-read-stream"></a>

#### createReadStream(path, [options])

Creates a new `TailFileStream` instance.

- `path` `<string>` The file path to be read.
- `options` `<Object>` Options for the stream.
  - `flags` `<string>` See [support of file system](https://nodejs.org/docs/latest/api/fs.html#file-system-flags) flags. Default: `'r'`.
  - `mode` `<number>` Default: `0o666`.
  - `start` `<number>` The byte offset to start reading from. Default: `0`.
  - `end` `<number>` The byte offset to stop reading. Default: `Infinity`.
  - `highWaterMark` `<number>` The maximum number of bytes to store in the internal buffer. Default: `64 * 1024`.
  - `autoWatch` `<boolean>` If `true`, the file will be watched for changes from the beginning. Default: `true`.
  - `persistent` `<boolean>` Indicates whether the process should continue to run as long as files are being watched. Default: `true`.
- Returns: `TailFileStream` The stream instance.

#### TailFileStream

The `TailFileStream` class extends the Node.js [Readable](https://nodejs.org/docs/latest/api/stream.html#class-streamreadable) stream.

`TailFileStream` emits the following events:

- `close` - Emits when the file is closed.
- `eof` - Emits when reaches the end of the file.
- `open` - Emits when the file is opened.
- `ready` - Emits when the file is ready to be read.

`TailFileStream` has the following properties:

- `bytesRead` `<number>` The number of bytes read from the file.
- `path` `<string>` The file path.
- `pending` `<boolean>` This property is true if the underlying file has not been opened yet, i.e. before the 'ready' event is emitted.
- `watching` `<boolean>` Indicates whether the file is being watched.
- `waiting` `<boolean>` Indicates whether the stream is waiting for file changes.

`TailFileStream` has the following methods:

- `watch()` - Starts watching the file for changes.
- `unwatch()` - Stops watching the file. If the stream is waiting for file changes, it will be closed.
If the stream is reading, the data will be read until the end of the file and then it will be closed.

<a name="license"></a>

## License

MIT
