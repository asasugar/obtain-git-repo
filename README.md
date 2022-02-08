# obtain-git-repo
Download and extract a git repository (GitHub, GitLab, Bitbucket) from node. Support es5 es6 Typescript.

## Installation
[How to use pnpm?](https://github.com/pnpm/pnpm)
 
    $ pnpm add obtain-git-repo -w // pnpm is recommended
    $ yarn add obtain-git-repo // use yarn
    $ npm i obtain-git-repo // use npm

## API

### download(repository, destination, options, callback)

Download a git `repository` to a `destination` folder with `options`, and `callback`.

#### repository
The shorthand repository string to download the repository from:

- **GitHub** - `github:owner/name` or simply `owner/name`
- **GitLab** - `gitlab:owner/name`
- **Bitbucket** - `bitbucket:owner/name`

The `repository` parameter defaults to the `master` branch, but you can specify a branch or tag as a URL fragment like `owner/name#my-branch`.
In addition to specifying the type of where to download, you can also specify a custom origin like `gitlab:custom.com:owner/name`.
Custom origin will default to `https` or `git@` for http and clone downloads respectively, unless protocol is specified.
Feel free to submit an issue or pull request for additional origin options.

In addition to having the shorthand for supported git hosts, you can also hit a repository directly with:

- **Direct** - `direct:url`

This will bypass the shorthand normalizer and pass `url` directly.
If using `direct` without clone, you must pass the full url to the zip file, including paths to branches if needed.
If using `direct` with clone, you must pass the full url to the git repo and you can specify a branch like `direct:url#my-branch`.

#### destination
The file path to download the repository to.

#### options
An optional options object parameter with download options. Options include:

- `clone` - boolean default `false` - If true use `git clone` instead of an http download. While this can be a bit slower, it does allow private repositories to be used if the appropriate SSH keys are setup.
- All other options (`proxy`, `headers`, `filter`, etc.) will be passed down accordingly and may override defaults
    - Additional download options: https://github.com/kevva/download#options
    - Additional clone options: https://github.com/jaz303/git-clone#clonerepo-targetpath-options-cb

#### callback
The callback function as `function (err)`.

## Examples
### Shorthand
Using http download from Github repository at master.
```javascript
download('asasugar/obtain-git-repo', 'obtain-git-repo', function (err) {
  console.log(err ? 'Error' : 'Success')
})
```

Using git clone from Bitbucket repository at my-branch.
```javascript
download('bitbucket:asasugar/obtain-git-repo#my-branch', 'obtain-git-repo', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
})
```

Using http download from GitLab repository with custom origin and token.
```javascript
download('gitlab:mygitlab.com:asasugar/obtain-git-repo#my-branch', 'obtain-git-repo', { headers: { 'PRIVATE-TOKEN': '1234' } } function (err) {
  console.log(err ? 'Error' : 'Success')
})
```

Using git clone from GitLab repository with custom origin and protocol.
Note that the repository type (`github`, `gitlab` etc.) is not required if cloning from a custom origin.
```javascript
download('https://mygitlab.com:asasugar/obtain-git-repo#my-branch', 'obtain-git-repo', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
})
```

### Direct
Using http download from direct url.
```javascript
download('direct:https://gitlab.com/asasugar/obtain-git-repo/repository/archive.zip', 'obtain-git-repo', function (err) {
  console.log(err ? 'Error' : 'Success')
})
```

Using git clone from direct url at master.
```javascript
download('direct:https://gitlab.com/asasugar/obtain-git-repo.git', 'obtain-git-repo', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
})
```

Using git clone from direct url at my-branch.
```javascript
download('direct:https://gitlab.com/asasugar/obtain-git-repo.git#my-branch', 'obtain-git-repo', { clone: true }, function (err) {
  console.log(err ? 'Error' : 'Success')
})
```

## License

MIT


## Thanks
[download-git-repo](https://gitlab.com/flippidippi/download-git-repo)