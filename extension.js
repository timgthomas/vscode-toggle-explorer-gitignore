const vscode = require('vscode')
const { registerCommand } = vscode.commands
const { getConfiguration } = vscode.workspace

const configKey = 'excludeGitIgnore'
const namespace = 'explorer-gitignore'

const activate = ({ subscriptions }) => {
  let toggleCommand = registerCommand(`${namespace}.toggle`, (value) => {
    const config = getConfiguration('explorer')
    const isGlobal = config.inspect(configKey).workspaceValue === undefined

    if (value === undefined) {
      value = config.get(configKey) ? false : true  
    }

    if (!value && isGlobal) { 
      //Use undefined only global setting, otherwise it removes the setting and it wont restore to the workspace when toggled back
      value = undefined
    }

    config.update(configKey, value, isGlobal)
    setContext(value)
  })

  let hideCommand = registerCommand(`${namespace}.hide`, () => {
    vscode.commands.executeCommand(`${namespace}.toggle`,  true)
  })

  let showCommand = registerCommand(`${namespace}.show`, () => {
    vscode.commands.executeCommand(`${namespace}.toggle`,  false)
  })

  let setContext = (state) => { 
    vscode.commands.executeCommand('setContext', `${namespace}.hidden`, state)
  }

  const config = getConfiguration('explorer')
  setContext(config.get(configKey));

  subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration(`explorer.${configKey}`)) {
        const config = getConfiguration('explorer')
        setContext(config.get(configKey));
      }
    })
  )

  subscriptions.push(toggleCommand)
  subscriptions.push(hideCommand)
  subscriptions.push(showCommand)
}

module.exports = { activate, deactivate: () => {} }
