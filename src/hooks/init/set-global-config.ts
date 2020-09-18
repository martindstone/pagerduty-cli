import {Hook} from '@oclif/config'

const globalAny: any = global

const hook: Hook<'init'> = async function (opts) {
  globalAny.config = opts.config;
}

export default hook
