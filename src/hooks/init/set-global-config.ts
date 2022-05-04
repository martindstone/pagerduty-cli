import {Hook} from '@oclif/core'

const globalAny: any = global

const hook: Hook<'init'> = async function (opts) {
  globalAny.config = opts.config
}

export default hook
