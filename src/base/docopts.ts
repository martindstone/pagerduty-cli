import {Interfaces} from '@oclif/core'

type Flag = Interfaces.Command.Flag
type Flags = Flag[]

// Modded copy of help/docopts.ts to work around weird behavior

export class DocOpts {
  public flagMap: {[index: string]: Flag}

  public flagList: Flags

  public constructor(private cmd: Interfaces.Command) {
    // Create a new map with references to the flags that we can manipulate.
    this.flagMap = {}
    this.flagList = Object.entries(cmd.flags || {})
    .filter(([_, flag]) => !flag.hidden)
    .map(([name, flag]) => {
      this.flagMap[name] = flag
      return {...flag, name: name}
    })
  }

  public static generate(cmd: Interfaces.Command): string {
    const docopts = new DocOpts(cmd)
    const elementMap = {}

    const elementList = [
      ...docopts.generateElements(elementMap, docopts.flagList.filter(flag => flag.required)),
      ...docopts.generateElements(elementMap, docopts.flagList.filter(flag => !flag.required)).map(x => `[${x}]`),
    ]
    return('<%= command.id %> ' + elementList.join(' '))
  }

  public generateElements(elementMap: {[index: string]: string} = {}, flagGroups: Flags): string[] {
    const elementStrs = []
    for (const flag of flagGroups) {
      let type = ''
      // not all flags have short names
      const flagName = flag.char ? `-${flag.char}` : `--${flag.name}`
      if (flag.type === 'option') {
        type = flag.options ? ` ${flag.options.join('|')}` : ' <value>'
      }

      const element = `${flagName}${type}`
      elementMap[flag.name] = element
      elementStrs.push(element)
    }

    return elementStrs
  }
}