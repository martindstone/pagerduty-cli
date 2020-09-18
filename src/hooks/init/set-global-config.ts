import {Hook} from '@oclif/config'

const hook: Hook<'init'> = async function (opts) {
  global.config = opts.config;
}

export default hook
