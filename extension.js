const vscode = require('vscode')
const { registerCommand } = vscode.commands
const { getConfiguration } = vscode.workspace

const configKey = 'excludeGitIgnore'
const namespace = 'toggle-explorer-gitignore'

const activate = ({ subscriptions }) => {
  let toggleCommand = registerCommand(`${namespace}.toggle`, () => {
    const config = getConfiguration('explorer')
    const currentValue = config.get(configKey)
    const newValue = currentValue ? undefined : true
    config.update(configKey, newValue, true)
  })

  let hideCommand = registerCommand(`${namespace}.hide`, () => {
    getConfiguration('explorer').update(configKey, true, true)
  })

  let showCommand = registerCommand(`${namespace}.show`, () => {
    getConfiguration('explorer').update(configKey, undefined, true)
  })

  subscriptions.push(toggleCommand)
  subscriptions.push(hideCommand)
  subscriptions.push(showCommand)
}

module.exports = { activate, deactivate: () => {} }
