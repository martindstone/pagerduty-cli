import { AuthenticatedBaseCommand } from '../../base/authenticated-base-command'
import { CliUx, Flags } from '@oclif/core'
import chalk from 'chalk'
import * as utils from '../../utils'

export default class BsCreate extends AuthenticatedBaseCommand<typeof BsCreate> {
  static description = 'Create a PagerDuty Business Service'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'The service\'s name',
      required: true,
    }),
    description: Flags.string({
      char: 'd',
      description: 'The service\'s description',
    }),
    contact: Flags.string({
      char: 'c',
      description: 'The owner of the Business Service.',
    }),
    team_id: Flags.string({
      char: 't',
      description: 'The ID of the team that owns the Business Service.',
      exclusive: ['team_name'],
    }),
    team_name: Flags.string({
      char: 'T',
      description: 'The name team that owns the Business Service.',
      exclusive: ['team_id'],
    }),
    open: Flags.boolean({
      char: 'o',
      description: 'Open the new service in the browser',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the service ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
  }

  async run() {
    const {
      name,
      description,
      contact: point_of_contact,
      team_id,
      team_name,
    } = this.flags

    let team
    if (team_id) {
      if (utils.invalidPagerDutyIDs([team_id]).length > 0) {
        this.error(`Invalid team ID ${chalk.bold.blue(team_id)}`, {exit: 1})
      }
      const team_exists = await this.pd.request({
        endpoint: `teams/${team_id}`,
        method: 'GET',
      })
      if (team_exists.isFailure) {
        this.error(`Team ID ${chalk.bold.blue(team_id)} wasn't found`, {exit: 1})
      }
      team = {
        id: team_id,
      }
    } else if (team_name) {
      const new_team_id = await this.pd.teamIDForName(team_name)
      if (!new_team_id) {
        this.error(`No team was found with the name ${chalk.bold.blue(team_name)}`, {exit: 1})
      }
      team = {
        id: new_team_id,
      }
    }

    const business_service: any = {
      business_service: {
        name,
        description,
        point_of_contact,
        team,
      },
    }

    CliUx.ux.action.start('Creating a PagerDuty business service')
    const r = await this.pd.request({
      endpoint: 'business_services',
      method: 'POST',
      data: business_service,
    })
    if (r.isFailure) {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(`Failed to create business service: ${r.getFormattedError()}`, {exit: 1})
    }
    CliUx.ux.action.stop(chalk.bold.green('done'))
    const returned_bs = r.getData()

    if (this.flags.pipe) {
      this.log(returned_bs.business_service.id)
    } else if (this.flags.open) {
      const domain = await this.pd.domain()
      const url = `https://${domain}.pagerduty.com/business-services/${returned_bs.business_service.id}`
      await CliUx.ux.wait(1000)
      CliUx.ux.action.start(`Opening ${chalk.bold.blue(url)} in the browser`)
      try {
        await CliUx.ux.open(url)
      } catch (error) {
        CliUx.ux.action.stop(chalk.bold.red('failed!'))
        this.error('Couldn\'t open your browser. Are you running as root?', { exit: 1 })
      }
      CliUx.ux.action.stop(chalk.bold.green('done'))
    } else {
      const domain = await this.pd.domain()
      const url = `https://${domain}.pagerduty.com/business-services/${returned_bs.business_service.id}`
      this.log(`Your new business service is at ${chalk.bold.blue(url)}`)
    }
  }
}
