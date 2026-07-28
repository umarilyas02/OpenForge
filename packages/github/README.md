# `@openforge/github`

GitHub App authentication and repository connection for OpenForge.

The package validates one-time OAuth state, stores user access tokens behind
encrypted references, selects only user-accessible installations and
repositories, detects protected branches, creates repositories idempotently, and
inspects source in a disposable compiler workspace.

`createGitHubRestTransport` provides the production HTTP boundary. Tests use a
fake transport; they do not mutate GitHub.
