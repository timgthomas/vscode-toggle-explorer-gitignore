const vscode = require('vscode')
const { registerCommand } = vscode.commands
const { getConfiguration } = vscode.workspace

const configKey = 'excludeGitIgnore'
const namespace = 'explorer-gitignore'

const activate = ({ subscriptions }) => {
  let toggleCommand = registerCommand(`${namespace}.toggle`, () => {
    const config = getConfiguration('explorer')
    const currentValue = config.get(configKey)
    const newValue = currentValue ? undefined : true
    config.update(configKey, newValue, true)
    setContext(newValue)
  })

  let hideCommand = registerCommand(`${namespace}.hide`, () => {
    getConfiguration('explorer').update(configKey, true, true)
    setContext(true)
  })

  let showCommand = registerCommand(`${namespace}.show`, () => {
    getConfiguration('explorer').update(configKey, undefined, true)
    setContext(undefined)
  })

  let setContext = (state) => { 
    vscode.commands.executeCommand('setContext', `${namespace}.toggled`, state)
  }

  const config = getConfiguration('explorer')
  setContext(config.get(configKey) || undefined);

  subscriptions.push(vscode.Disposable.from(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration(`explorer.${configKey}`)) {
          const config = getConfiguration('explorer')
          setContext(config.get(configKey) || undefined);
        }
      })
    )
  )


  subscriptions.push(toggleCommand)
  subscriptions.push(hideCommand)
  subscriptions.push(showCommand)
}

module.exports = { activate, deactivate: () => {} }
