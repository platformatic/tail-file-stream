import { expectType } from 'tsd'
import { Writable } from 'node:stream'
import {
  createReadStream,
  TailFileStream,
  TailFileStreamOptions
} from './index'

const options: TailFileStreamOptions = {
  highWaterMark: 1024,
  flags: 'r',
  mode: 0o666,
  start: 0,
  end: 1024,
  autoWatch: true,
  persistent: true
}

const stream = createReadStream('path/to/file', options)

expectType<TailFileStream>(stream)
expectType<boolean>(stream.pending)
expectType<boolean>(stream.watching)
expectType<boolean>(stream.waiting)
expectType<boolean>(stream.destroyed)
expectType<boolean>(stream.readable)
expectType<boolean>(stream.closed)

expectType<void>(stream.watch())
expectType<void>(stream.unwatch())
expectType<void>(stream.close())

const writable = new Writable()
expectType<Writable>(stream.pipe(writable))

expectType<TailFileStream>(stream.destroy())
expectType<TailFileStream>(stream.pause())
expectType<TailFileStream>(stream.resume())
expectType<any>(stream.read(42))
