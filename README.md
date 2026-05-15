# MuhammadHussain-mern-10pshine

## SonarQube analysis

From the repo root, run:

- `npm run analyze:open`

This will automatically:

1. install needed dependencies for both `backend` and `frontend`
2. generate backend and frontend coverage reports
3. run SonarQube analysis
4. open the SonarQube project dashboard in your browser

### Initial Sonar authentication setup

The scanner now uses `SONAR_TOKEN` for authorization. Set the token once in your environment before the first run.

On Windows PowerShell (temporary for current session):

- `$env:SONAR_TOKEN = "your_token_here"`

To make it persistent across PowerShell sessions, add it to your PowerShell profile:

- `notepad $PROFILE`
- add the line: `$env:SONAR_TOKEN = "your_token_here"`
- save and restart PowerShell

On macOS/Linux:

- `export SONAR_TOKEN=your_token_here`

To persist permanently, add that line to your `~/.bashrc`, `~/.zshrc`, or shell profile.

After that, run:

- `npm run analyze:open`

This should work as a single command.

If you want to run only coverage first:

- `npm run coverage`

If you want to run only Sonar after coverage:

- `npm run sonar`

> Note: `npm run sonar` now passes `SONAR_TOKEN` directly to the scanner with `-Dsonar.token=%SONAR_TOKEN%`.
