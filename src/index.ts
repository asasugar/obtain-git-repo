import downloadUrl from 'download'
import gitclone from 'git-clone'
import rimraf from 'rimraf'
/**
 * Expose `download`.
 */

/**
 * Download `repo` to `dest` and callback `fn(err)`.
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} fn
 */

export function download(
  repo: string,
  dest: string,
  opts: { clone?: boolean; headers?: Record<string, string> } | null,
  fn: (arg0?: Error | undefined) => void,
) {
  if (typeof opts === 'function') {
    fn = opts
    opts = null
  }
  opts = opts || {}
  const clone = opts.clone || false
  delete opts.clone
  const newRepo = normalize(repo)
  let url = ''
  if (newRepo) url = newRepo?.url || getUrl(newRepo, clone) || ''

  if (clone && url) {
    const cloneOptions = {
      checkout: newRepo?.checkout,
      shallow: newRepo?.checkout === 'master',
      ...opts,
    }
    gitclone(url, dest, cloneOptions, (err) => {
      if (err === undefined) {
        rimraf(`${dest}/.git`, () => {})
        fn()
      }
      else {
        fn(err)
      }
    })
  }
  else {
    const downloadOptions = {
      extract: true,
      strip: 1,
      mode: '666',
      ...opts,
      headers: {
        accept: 'application/zip',
        ...(opts.headers || {}),
      },
    }
    downloadUrl(url, dest, downloadOptions)
      .then(() => {
        fn()
      })
      .catch((err) => {
        fn(err)
      })
  }
}

/**
 * Normalize a repo string.
 *
 * @param {String} repo
 * @return {Object}
 */

function normalize(repo: string) {
  if (typeof repo === 'string') {
    let regex = /^(?:(direct):([^#]+)(?:#(.+))?)$/
    let match = regex.exec(repo)

    if (match) {
      const url = match[2]
      const directCheckout = match[3] || 'master'

      return {
        type: 'direct',
        url,
        checkout: directCheckout,
      }
    }
    else {
      regex
        = /^(?:(github|gitlab|bitbucket):)?(?:(.+):)?([^/]+)\/([^#]+)(?:#(.+))?$/
      match = regex.exec(repo)
      const type = match?.[1] || 'github'
      let origin = match?.[2] || null
      const owner = match?.[3]
      const name = match?.[4]
      const checkout = match?.[5] || 'master'

      if (origin == null) {
        if (type === 'github') origin = 'github.com'
        else if (type === 'gitlab') origin = 'gitlab.com'
        else if (type === 'bitbucket') origin = 'bitbucket.org'
      }

      return {
        type,
        origin,
        owner,
        name,
        checkout,
      }
    }
  }
}

/**
 * Adds protocol to url in none specified
 *
 * @param {String} url
 * @return {String}
 */

function addProtocol(origin: string, clone: boolean) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone) origin = `git@${origin}`
    else origin = `https://${origin}`
  }

  return origin
}

/**
 * Return a zip or git url for a given `repo`.
 *
 * @param {Object} repo
 * @return {String}
 */

function getUrl(
  repo:
  | {
    type: string
    url: string
    checkout: string
    origin?: undefined
    owner?: undefined
    name?: undefined
  }
  | {
    type: string
    origin: string | null
    owner: string | undefined
    name: string | undefined
    checkout: string
    url?: undefined
  },
  clone: boolean,
) {
  let url

  // Get origin with protocol and add trailing slash or colon (for ssh)
  let origin = (repo.origin && addProtocol(repo.origin, clone)) || ''
  if (/^git@/i.test(origin)) origin = `${origin}:`
  else origin = `${origin}/`

  // Build url
  if (clone) {
    url = `${origin + repo.owner}/${repo.name}.git`
  }
  else {
    if (repo.type === 'github') {
      url = `${origin + repo.owner}/${repo.name}/archive/${repo.checkout}.zip`
    }
    else if (repo.type === 'gitlab') {
      url = `${origin + repo.owner}/${repo.name}/repository/archive.zip?ref=${
        repo.checkout
      }`
    }
    else if (repo.type === 'bitbucket') {
      url = `${origin + repo.owner}/${repo.name}/get/${repo.checkout}.zip`
    }
  }

  return url
}
