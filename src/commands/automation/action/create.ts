import { AuthenticatedBaseCommand } from "../../../base/authenticated-base-command";
import chalk from 'chalk'
import { CliUx, Flags } from "@oclif/core";
import * as utils from '../../../utils'
import getStream from 'get-stream'

export default class AutomationActionCreate extends AuthenticatedBaseCommand<typeof AutomationActionCreate> {
  static description = 'Create a PagerDuty Automation Action'

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'The name of the new automation action',
      required: true,
    }),
    description: Flags.string({
      char: 'd',
      description: 'The description of the new automation action',
      required: true,
    }),
    classification: Flags.string({
      char: 'c',
      description: 'The classification of the new automation action',
      options: ['diagnostic', 'remediation'],
    }),
    runner_id: Flags.string({
      char: 'r',
      description: 'The ID of the runner to run this action',
      exclusive: ['runner_name'],
    }),
    runner_name: Flags.string({
      char: 'R',
      description: 'The name of the runner to run this action',
      exclusive: ['runner_id'],
    }),
    service_ids: Flags.string({
      char: 's',
      description: 'The IDs of services whose incidents will have this action available.',
      multiple: true,
    }),
    service_names: Flags.string({
      char: 'S',
      description: 'The names of services whose incidents will have this action available.',
      multiple: true,
    }),
    team_ids: Flags.string({
      char: 't',
      description: 'The IDs of teams that will have access to run this action.',
      multiple: true,
    }),
    team_names: Flags.string({
      char: 'T',
      description: 'The names of teams that will have access to run this action.',
      multiple: true,
    }),
    script: Flags.string({
      char: 'x',
      description: 'For script actions - the body of the script to be executed on the runner.',
      exclusive: ['script_from_stdin', 'job_id'],
    }),
    script_from_stdin: Flags.boolean({
      char: 'X',
      description: 'For script actions - read the body of the script from stdin.',
      exclusive: ['script', 'job_id'],
    }),
    invocation_command: Flags.string({
      char: 'i',
      description: 'For script actions - if the script body is not an executable file, the path to the command to run it with.',
      exclusive: ['job_id'],
    }),
    job_id: Flags.string({
      char: 'j',
      description: 'For process automation actions - the job ID of the job to run',
      exclusive: ['script', 'script_from_stdin'],
    }),
    job_arguments: Flags.string({
      aliases: ['ja'],
      description: 'For process automation actions - arguments to pass to the job',
      dependsOn: ['job_id'],
    }),
    pipe: Flags.boolean({
      char: 'p',
      description: 'Print the new action ID only to stdout, for use with pipes.',
      exclusive: ['open'],
    }),
    open: Flags.boolean({
      char: 'o',
      description: 'Open the new action in the browser once it\'s been created',
    })
  }
  async run() {
    const {
      name,
      description,
      classification: action_classification,
      runner_id: runner_id_flag,
      runner_name,
      service_ids: service_ids_flag,
      service_names,
      team_ids: team_ids_flag,
      team_names,
      script: script_flag,
      script_from_stdin,
      job_id: process_automation_job_id,
      job_arguments: process_automation_job_arguments,
      invocation_command,
      pipe,
    } = this.flags

    if (!(runner_id_flag || runner_name)) {
      this.error('You must specify a runner to run the action using either -r or -R', { exit: 1 })
    }
    let action_type!: string
    if (script_flag || script_from_stdin) {
      action_type = 'script'
    } else if (process_automation_job_id) {
      action_type = 'process_automation'
    } else {
      this.error('You must specify either a process automation job id using -j, or a script using -x or -X')
    }

    let script = ''
    if (action_type === 'script') {
      if (script_from_stdin) {
        this.log(`Type or paste your script below; hit ${chalk.bold('^D')} when you're done, or hit ${chalk.bold('^C')} to abort.`)
        script = await getStream(process.stdin)
      } else {
        script = script_flag as string
      }
      if (script.trim().length === 0) {
        this.error('You can\'t have a script action with a blank script, sorry!', { exit: 1 })
      }
    }

    const runners = await this.pd.fetchWithSpinner(
      'automation_actions/runners',
      {
        activityDescription: 'Getting runners',
        stopSpinnerWhenDone: false,
      }
    )

    let runner
    if (runner_id_flag) {
      runner = runners.find(x => x.id === runner_id_flag)
      if (!runner) this.error(`No runner was found with the ID ${chalk.bold.blue(runner_id_flag)}`, { exit: 1 })
    } else {
      const foundRunners = runners.filter(x => x.name === runner_name)
      if (foundRunners.length === 0) {
        this.error(`No runner was found with the name ${chalk.bold.blue(runner_name)}`, { exit: 1 })
      }
      if (foundRunners.length > 1) {
        this.error(`More than one runner was found with the name ${chalk.bold.blue(runner_name)}`, { exit: 1 })
      }
      runner = foundRunners[0]
    }

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

    let service_ids: string[] = []
    if (service_ids_flag) {
      const invalidServiceIDs = utils.invalidPagerDutyIDs(service_ids_flag)
      if (invalidServiceIDs.length > 0) {
        this.error(`Invalid service IDs: ${chalk.bold.blue(invalidServiceIDs.join(', '))}`, { exit: 1 })
      }
      service_ids = [...service_ids, ...service_ids_flag]
    }
    if (service_names) {
      for (const service_name of service_names) {
        CliUx.ux.action.start(`Finding service ${chalk.bold.blue(service_name)}`)
        const service_id = await this.pd.serviceIDForName(service_name)
        if (!service_id) {
          this.error(`Service name ${chalk.bold.blue(service_name)} wasn't found`, { exit: 1 })
        }
        service_ids.push(service_id)
      }
    }
    service_ids = [...new Set(service_ids)]

    const body = {
      action: {
        name,
        description,
        runner: runner.id,
        action_type,
        action_data_reference: {},
        action_classification,
        teams: team_ids.map(x => ({ id: x, type: 'team_reference' })),
        services: service_ids.map(x => ({ id: x, type: 'service_reference' })),
      }
    }

    if (action_type === 'script') {
      body.action.action_data_reference = {
        script,
        invocation_command,
      }
    } else {
      body.action.action_data_reference = {
        process_automation_job_id,
        process_automation_job_arguments
      }
    }

    CliUx.ux.action.start(`Creating a ${chalk.bold.blue(action_type === 'script' ? 'script' : 'process automation')} action`)
    const r = await this.pd.request({
      endpoint: 'automation_actions/actions',
      method: 'POST',
      data: body
    })
    if (r.isSuccess) {
      CliUx.ux.action.stop(chalk.bold.green('done'))
      const new_action_id = r.getData().action.id
      if (pipe) {
        this.log(new_action_id)
        this.exit()
      }
      const action_url = `https://${await this.pd.domain()}.pagerduty.com/automation-actions/actions/${new_action_id}`
      this.log(`Your new action is at ${chalk.bold.blue(action_url)}`)
      if (this.flags.open) {
        try {
          await CliUx.ux.open(action_url)
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