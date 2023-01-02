import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'

export default class UserCreate extends AuthenticatedBaseCommand<typeof UserCreate> {
  static description = 'Create a PagerDuty User'

  static flags = {
    email: Flags.string({
      char: 'e',
      description: 'The user\'s login email',
      required: true,
    }),
    name: Flags.string({
      char: 'n',
      description: 'The user\'s name',
      required: true,
    }),
    timezone: Flags.string({
      char: 'z',
      description: 'The user\'s time zone',
      default: 'UTC',
    }),
    color: Flags.string({
      char: 'c',
      description: 'The user\'s schedule color',
    }),
    role: Flags.string({
      char: 'r',
      description: 'The user\'s role',
      default: 'user',
      options: [
        'admin',
        'read_only_user',
        'read_only_limited_user',
        'user',
        'limited_user',
        'observer',
        'restricted_access',
      ],
    }),
    title: Flags.string({
      char: 't',
      description: 'The user\'s job title',
    }),
    description: Flags.string({
      char: 'd',
      description: 'The user\'s job description',
    }),
    password: Flags.string({
      char: 'w',
      description: 'The user\'s password - if not specified, a random password will be generated',
    }),
    show_password: Flags.boolean({
      description: 'Show the user\'s password when creating',
    }),
    from: Flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    open: Flags.boolean({
      char: 'o',
      description: 'Open the new user in the browser',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the user ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const headers: Record<string, string> = {}

    const user: any = {
      user: {
        type: 'user',
        email: this.flags.email,
        name: this.flags.name,
        time_zone: this.flags.timezone,
        role: this.flags.role,
      },
    }

    if (this.flags.color) user.user.color = this.flags.color
    if (this.flags.title) user.user.job_title = this.flags.title
    if (this.flags.description) user.user.description = this.flags.description
    if (this.flags.password) {
      user.user.password = this.flags.password
    } else {
      user.user.password = Math.random().toString(16).split('.').pop()
    }

    CliUx.ux.action.start('Creating PagerDuty user' + (this.flags.show_password ? ` with password ${chalk.bold.blue(user.user.password)}` : ''))
    const r = await this.pd.request({
      endpoint: 'users',
      method: 'POST',
      data: user,
      headers: headers,
    })
    if (r.isFailure) {
      this.error(`Failed to create user: ${r.getFormattedError()}`, { exit: 1 })
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_user = r.getData()

    if (this.flags.pipe) {
      this.log(returned_user.user.id)
    } else if (this.flags.open) {
      CliUx.ux.action.start(`Opening ${chalk.bold.blue(returned_user.user.html_url)} in the browser`)
      try {
        await CliUx.ux.open(returned_user.user.html_url)
      } catch (error) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error('Couldn\'t open your browser. Are you running as root?', { exit: 1 })
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new user is at ${chalk.bold.blue(returned_user.user.html_url)}`)
    }
  }
}
