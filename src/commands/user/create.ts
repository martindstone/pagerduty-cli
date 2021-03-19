/* eslint-disable complexity */
import Command from '../../base'
import {flags} from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'

export default class UserCreate extends Command {
  static description = 'Create a PagerDuty User'

  static flags = {
    ...Command.flags,
    email: flags.string({
      char: 'e',
      description: 'The user\'s login email',
      required: true,
    }),
    name: flags.string({
      char: 'n',
      description: 'The user\'s name',
      required: true,
    }),
    timezone: flags.string({
      char: 'z',
      description: 'The user\'s time zone',
      default: 'UTC',
    }),
    color: flags.string({
      char: 'c',
      description: 'The user\'s schedule color',
    }),
    role: flags.string({
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
    title: flags.string({
      char: 't',
      description: 'The user\'s job title',
    }),
    description: flags.string({
      char: 'd',
      description: 'The user\'s job description',
    }),
    password: flags.string({
      char: 'w',
      description: 'The user\'s password - if not specified, a random password will be generated',
    }),
    show_password: flags.boolean({
      description: 'Show the user\'s password when creating',
    }),
    from: flags.string({
      char: 'F',
      description: 'Login email of a PD user account for the "From:" header. Use only with legacy API tokens.',
    }),
    open: flags.boolean({
      char: 'o',
      description: 'Open the new user in the browser',
    }),
    pipe: flags.boolean({
      char: 'p',
      description: 'Print the user ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const {flags} = this.parse(UserCreate)

    const headers: Record<string, string> = {}

    const user: any = {
      user: {
        type: 'user',
        email: flags.email,
        name: flags.name,
        time_zone: flags.timezone,
        role: flags.role,
      },
    }

    if (flags.color) user.user.color = flags.color
    if (flags.title) user.user.job_title = flags.title
    if (flags.description) user.user.description = flags.description
    if (flags.password) {
      user.user.password = flags.password
    } else {
      user.user.password = Math.random().toString(16).split('.').pop()
    }

    cli.action.start('Creating PagerDuty user' + (flags.show_password ? ` with password ${chalk.bold.blue(user.user.password)}` : ''))
    const r = await this.pd.request({
      endpoint: 'users',
      method: 'POST',
      data: user,
      headers: headers,
    })
    if (r.isFailure) {
      this.error(`Failed to create user: ${r.getFormattedError()}`, {exit: 1})
    }
    cli.action.stop(chalk.bold.green('done'))
    const returned_user = r.getData()

    if (flags.pipe) {
      this.log(returned_user.user.id)
    } else if (flags.open) {
      cli.action.start(`Opening ${chalk.bold.blue(returned_user.user.html_url)} in the browser`)
      try {
        cli.open(returned_user.user.html_url)
      } catch (error) {
        this.error('Couldn\'t open your browser. Are you running as root?', {exit: 1})
      }
      cli.action.stop(chalk.bold.green('done'))
    } else {
      this.log(`Your new user is at ${chalk.bold.blue(returned_user.user.html_url)}`)
    }
  }
}
