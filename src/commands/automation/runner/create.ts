import { AuthenticatedBaseCommand } from "../../../base/authenticated-base-command";
import chalk from 'chalk'
import { CliUx, Flags } from "@oclif/core";
import * as utils from '../../../utils'
import getStream from 'get-stream'

export default class AutomationRunnerCreate extends AuthenticatedBaseCommand<typeof AutomationRunnerCreate> {
  static description = 'Create a PagerDuty Automation Action'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'The name of the new runner',
      required: true,
    }),
    description: Flags.string({
      char: 'd',
      description: 'The description of the new runner',
      required: true,
    }),
    team_ids: Flags.string({
      char: 't',
      description: 'The IDs of teams associated with this runner',
      multiple: true,
    }),
    team_names: Flags.string({
      char: 'T',
      description: 'The names of teams associated with this runner',
      multiple: true,
    }),
    runner_type: Flags.string({
      char: 'y',
      description: 'The type of runner to create. Use `sidecar` to create a Process Automation runner, and `runbook` to create a Runbook Automation runner',
      required: true,
      options: ['sidecar', 'runbook'],
    }),
    runbook_base_uri: Flags.string({
      char: 'u',
      description: 'For Runbook Automation runners, the base URI of the Runbook server to connect to',
    }),
    runbook_api_key: Flags.string({
      char: 'k',
      description: 'For Runbook Automation runners, the API key to use to connect to the Runbook server',
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print only the new runner credentials (for Process Automation runners) or ID (for Runbook Automation runners) to stdout.',
      exclusive: ['open'],
    }),
    open: Flags.boolean({
      char: 'o',
      description: 'Open the new runner in the browser once it\'s been created',
    })
  }
  async run() {
    const {
      name,
      description,
      team_ids: team_ids_flag,
      team_names,
      runner_type,
      runbook_base_uri,
      runbook_api_key,
      pipe,
    } = this.flags

    let team_ids: string[] = []
    if (team_ids_flag) {
      const invalidTeamIDs = utils.invalidPagerDutyIDs(team_ids_flag)
      if (invalidTeamIDs.length > 0) {
        this.error(`Invalid team IDs: ${chalk.bold.blue(invalidTeamIDs.join(', '))}`, { exit: 1 })
      }
      team_ids = [...team_ids, ...team_ids_flag]
    }
    if (team_names) {
      for (const team_name of team_names) {
        CliUx.ux.action.start(`Finding team ${chalk.bold.blue(team_name)}`)
        const team_id = await this.pd.teamIDForName(team_name)
        if (!team_id) {
          this.error(`Team name ${chalk.bold.blue(team_name)} wasn't found`, { exit: 1 })
        }
        team_ids.push(team_id)
      }
    }
    team_ids = [...new Set(team_ids)]

    const body = {
      runner: {
        name,
        description,
        runner_type,
        teams: team_ids.map(x => ({ id: x, type: 'team_reference' })),
        runbook_base_uri,
        runbook_api_key,
      }
    }

    CliUx.ux.action.start(`Creating a ${chalk.bold.blue(runner_type === 'runbook' ? 'runbook automation' : 'process automation')} runner`)
    const r = await this.pd.request({
      endpoint: 'automation_actions/runners',
      method: 'POST',
      data: body
    })
    if (r.isSuccess) {
      CliUx.ux.action.stop(chalk.bold.green('done'))
      const runner = r.getData().runner

      if (this.flags.pipe) {
        if (runner_type === 'sidecar') {
          this.log(`id:${runner.id}\nsecret:${runner.secret}\ntoken:<API_TOKEN>`)
        } else {
          this.log(runner.id)
        }
        this.exit()
      }

      const runner_url = `https://${await this.pd.domain()}.pagerduty.com/automation-actions/runners/${runner.id}`
      if (runner_type === 'sidecar') {
        this.log('\n' + chalk.bold('Runner credentials (save these somewhere safe):'))
        this.log(`id:${runner.id}\nsecret:${runner.secret}\ntoken:<API_TOKEN>\n`)
      }
      this.log(`Your new runner is at ${chalk.bold.blue(runner_url)}`)
      if (this.flags.open) {
        try {
          await CliUx.ux.open(runner_url)
        } catch (error) {
          this.error('Couldn\'t open your browser. Are you running as root?', { exit: 1 })
        }
      }
    } else {
      CliUx.ux.action.stop(chalk.bold.red('failed!'))
      this.error(r.getFormattedError(), { exit: 1 })
    }
  }
}