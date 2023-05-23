type OptionDocumentation = {
  name: string;
  fullDescription: string;
  type?: string;
  children?: OptionDocumentation[];
};

const options: OptionDocumentation[] = [
  {
    name: "org",
    type: "string",
    fullDescription: "The slug of the Sentry organization associated with the app.",
  },
  {
    name: "project",
    fullDescription:
      "The slug of the Sentry project associated with the app.\n\nThis value can also be specified via the `SENTRY_PROJECT` environment variable.",
  },
  {
    name: "authToken",
    type: "string",
    fullDescription:
      "The authentication token to use for all communication with Sentry. Can be obtained from https://sentry.io/settings/account/api/auth-tokens/. Required scopes: project:releases (and org:read if setCommits option is used).\n\nThis value can also be specified via the `SENTRY_AUTH_TOKEN` environment variable.",
  },
  {
    name: "url",
    type: "string",
    fullDescription:
      "The base URL of your Sentry instance. Use this if you are using a self-hosted or Sentry instance other than sentry.io.\n\nThis value can also be set via the SENTRY_URL environment variable.\n\nDefaults to https://sentry.io/, which is the correct value for SaaS customers.",
  },
  {
    name: "headers",
    type: "Record<string, string>",
    fullDescription: "Headers added to every outgoing network request.",
  },
  {
    name: "debug",
    type: "boolean",
    fullDescription: "Print useful debug information. Defaults to `false`.",
  },
  {
    name: "silent",
    type: "boolean",
    fullDescription: "Suppresses all logs. Defaults to `false`.",
  },
  {
    name: "errorHandler",
    type: "(err: Error) => void",
    fullDescription: `When an error occurs during rlease creation or sourcemaps upload, the plugin will call this function.

By default, the plugin will simply throw an error, thereby stopping the bundling process. If an \`errorHandler\` callback is provided, compilation will continue, unless an error is thrown in the provided callback.

To allow compilation to continue but still emit a warning, set this option to the following:

\`\`\`
errorHandler: (err) => {
  console.warn(err);
}
\`\`\`
`,
  },
  {
    name: "telemetry",
    type: "boolean",
    fullDescription:
      "If set to true, internal plugin errors and performance data will be sent to Sentry.\n\nAt Sentry we like to use Sentry ourselves to deliver faster and more stable products. We're very careful of what we're sending. We won't collect anything other than error and high-level performance data. We will never collect your code or any details of the projects in which you're using this plugin.\n\nDefaults to `true`.",
  },
  {
    name: "disable",
    type: "boolean",
    fullDescription: "Completely disables all functionality of the plugin. Defaults to `false`.",
  },
  {
    name: "sourcemaps",
    fullDescription:
      "Options for source maps uploading. Leave this option undefined if you do not want to upload source maps to Sentry.",
    children: [
      {
        name: "assets",
        type: "string | string[]",
        fullDescription:
          "A glob or an array of globs that specifies the build artifacts that should be uploaded to Sentry.\n\nThe globbing patterns follow the implementation of the `glob` package. (https://www.npmjs.com/package/glob)\n\nUse the `debug` option to print information about which files end up being uploaded.",
      },
      {
        name: "ignore",
        type: "string | string[]",
        fullDescription:
          "A glob or an array of globs that specifies which build artifacts should not be uploaded to Sentry.\n\nDefault: `[]`\n\nThe globbing patterns follow the implementation of the `glob` package. (https://www.npmjs.com/package/glob)\n\nUse the `debug` option to print information about which files end up being uploaded.",
      },
      {
        name: "rewriteSources",
        type: "(source: string, map: any) => string",
        fullDescription:
          "Hook to rewrite the `sources` field inside the source map before being uploaded to Sentry. Does not modify the actual source map. Effectively, this modifies how files inside the stacktrace will show up in Sentry.\n\nDefaults to making all sources relative to `process.cwd()` while building.",
      },
      {
        name: "deleteFilesAfterUpload",
        type: "string | string[]",
        fullDescription:
          "A glob or an array of globs that specifies the build artifacts that should be deleted after the artifact upload to Sentry has been completed.\n\nThe globbing patterns follow the implementation of the `glob` package. (https://www.npmjs.com/package/glob)\n\nUse the `debug` option to print information about which files end up being deleted.",
      },
    ],
  },

  {
    name: "release",
    fullDescription:
      "Options related to managing the Sentry releases for a build.\n\nMore info: https://docs.sentry.io/product/releases/",
    children: [
      {
        name: "name",
        type: "string",
        fullDescription:
          "Unique identifier for the release you want to create.\n\nThis value can also be specified via the `SENTRY_RELEASE` environment variable.\n\nDefaults to automatically detecting a value for your environment. This includes values for Cordova, Heroku, AWS CodeBuild, CircleCI, Xcode, and Gradle, and otherwise uses the git `HEAD`'s commit SHA. (the latterrequires access to git CLI and for the root directory to be a valid repository)\n\nIf you didn't provide a value and the plugin can't automatically detect one, no release will be created.",
      },
      {
        name: "inject",
        type: "boolean",
        fullDescription:
          "Whether the plugin should inject release information into the build for the SDK to pick it up when sending events. (recommended)\n\nDefaults to `true`.",
      },
      {
        name: "disable",
        type: "boolean",
        fullDescription:
          "If set to `true` the plugin will not create or update releases in Sentry during build. Injected release values will still create releases (see `release.inject` option).",
      },
      {
        name: "create",
        type: "boolean",
        fullDescription:
          "Whether the plugin should create a release on Sentry during the build. Note that a release may still appear in Sentry even if this is value is `false` because any Sentry event that has a release value attached will automatically create a release. (for example via the `inject` option)\n\nDefaults to `true`.",
      },
      {
        name: "finalize",
        type: "boolean",
        fullDescription:
          "Whether the Sentry release should be automatically finalized (meaning an end timestamp is added) after the build ends.\n\nDefaults to `true`.",
      },
      {
        name: "dist",
        type: "string",
        fullDescription:
          "Unique identifier for the distribution, used to further segment your release.",
      },
      {
        name: "vcsRemote",
        type: "string",
        fullDescription:
          "Version control system remote name.\n\nThis value can also be specified via the `SENTRY_VSC_REMOTE` environment variable.\n\nDefaults to 'origin'.",
      },
      {
        name: "setCommits",
        fullDescription: "Option to associate the created release with its commits in Sentry.",
        children: [
          {
            name: "previousCommit",
            type: "string",
            fullDescription:
              "The commit before the beginning of this release (in other words, the last commit of the previous release).\n\nDefaults to the last commit of the previous release in Sentry.\n\nIf there was no previous release, the last 10 commits will be used.",
          },
          {
            name: "ignoreMissing",
            type: "boolean",
            fullDescription:
              "If the flag is to `true` and the previous release commit was not found in the repository, the plugin creates a release with the default commits count instead of failing the command.\n\nDefaults to `false`.",
          },
          {
            name: "ignoreEmpty",
            type: "boolean",
            fullDescription:
              "If this flag is set, the setCommits step will not fail and just exit silently if no new commits for a given release have been found.\n\nDefaults to `false`.",
          },
          {
            name: "auto",
            type: "boolean",
            fullDescription:
              "Automatically sets `commit` and `previousCommit`. Sets `commit` to `HEAD` and `previousCommit` as described in the option's documentation.\n\nIf you set this to `true`, manually specified `commit` and `previousCommit` options will be overridden. It is best to not specify them at all if you set this option to `true`.",
          },
          {
            name: "repo",
            type: "string",
            fullDescription:
              "The full repo name as defined in Sentry.\n\nRequired if the `auto` option is not set to `true`.",
          },
          {
            name: "commit",
            type: "string",
            fullDescription:
              "The current (last) commit in the release.\n\nRequired if the `auto` option is not set to `true`.",
          },
        ],
      },
      {
        name: "deploy",
        fullDescription: "Adds deployment information to the release in Sentry.",
        children: [
          {
            name: "env",
            type: "string",
            fullDescription:
              "Environment for this release. Values that make sense here would be `production` or `staging`.",
          },
          {
            name: "started",
            type: "number | string",
            fullDescription:
              "Deployment start time in Unix timestamp (in seconds) or ISO 8601 format.",
          },
          {
            name: "finished",
            type: "number | string",
            fullDescription:
              "Deployment finish time in Unix timestamp (in seconds) or ISO 8601 format.",
          },
          {
            name: "time",
            type: "number",
            fullDescription:
              "Deployment duration (in seconds). Can be used instead of started and finished.",
          },
          {
            name: "name",
            type: "string",
            fullDescription: "Human readable name for the deployment.",
          },
          {
            name: "url",
            type: "string",
            fullDescription: "URL that points to the deployment.",
          },
        ],
      },
      {
        name: "cleanArtifacts",
        type: "boolean",
        fullDescription:
          "Remove all previously uploaded artifacts for this release on Sentry before the upload.\n\nDefaults to `false`.",
      },
      {
        name: "uploadLegacySourcemaps",
        type: "string | IncludeEntry | Array<string | IncludeEntry>",
        fullDescription: `Legacy method of uploading source maps. (not recommended unless necessary)
One or more paths that should be scanned recursively for sources.

Each path can be given as a string or an object with more specific options.

The modern version of doing source maps upload is more robust and way easier to get working but has to inject a very small snippet of JavaScript into your output bundles.
In situations where this leads to problems (e.g subresource integrity) you can use this option as a fallback.

The \`IncludeEntry\` type looks as follows:

\`\`\`ts
type IncludeEntry = {
    /**
     * One or more paths to scan for files to upload.
     */
    paths: string[];

    /**
     * One or more paths to ignore during upload.
     * Overrides entries in ignoreFile file.
     *
     * Defaults to \`['node_modules']\` if neither \`ignoreFile\` nor \`ignore\` is set.
     */
    ignore?: string | string[];

    /**
     * Path to a file containing list of files/directories to ignore.
     *
     * Can point to \`.gitignore\` or anything with the same format.
     */
    ignoreFile?: string;

    /**
     * Array of file extensions of files to be collected for the file upload.
     *
     * By default the following file extensions are processed: js, map, jsbundle and bundle.
     */
    ext?: string[];

    /**
     * URL prefix to add to the beginning of all filenames.
     * Defaults to '~/' but you might want to set this to the full URL.
     *
     * This is also useful if your files are stored in a sub folder. eg: url-prefix '~/static/js'.
     */
    urlPrefix?: string;

    /**
     * URL suffix to add to the end of all filenames.
     * Useful for appending query parameters.
     */
    urlSuffix?: string;

    /**
     * When paired with the \`rewrite\` option, this will remove a prefix from filename references inside of
     * sourcemaps. For instance you can use this to remove a path that is build machine specific.
     * Note that this will NOT change the names of uploaded files.
     */
    stripPrefix?: string[];

    /**
     * When paired with the \`rewrite\` option, this will add \`~\` to the \`stripPrefix\` array.
     *
     * Defaults to \`false\`.
     */
    stripCommonPrefix?: boolean;

    /**
     * Determines whether sentry-cli should attempt to link minified files with their corresponding maps.
     * By default, it will match files and maps based on name, and add a Sourcemap header to each minified file
     * for which it finds a map. Can be disabled if all minified files contain sourceMappingURL.
     *
     * Defaults to true.
     */
    sourceMapReference?: boolean;

    /**
     * Enables rewriting of matching source maps so that indexed maps are flattened and missing sources
     * are inlined if possible.
     *
     * Defaults to true
     */
    rewrite?: boolean;

    /**
     * When \`true\`, attempts source map validation before upload if rewriting is not enabled.
     * It will spot a variety of issues with source maps and cancel the upload if any are found.
     *
     * Defaults to \`false\` as this can cause false positives.
     */
    validate?: boolean;
};
\`\`\`

`,
      },
    ],
  },
  {
    name: "_experiments",
    type: "string",
    fullDescription:
      "Options that are considered experimental and subject to change. This option does not follow semantic versioning and may change in any release.",
    children: [
      {
        name: "injectBuildInformation",
        type: "boolean",
        fullDescription:
          "If set to true, the plugin will inject an additional `SENTRY_BUILD_INFO` variable. This contains information about the build, e.g. dependencies, node version and other useful data.\n\nDefaults to `false`.",
      },
    ],
  },
];

function generateTableOfContents(
  depth: number,
  parentId: string,
  nodes: OptionDocumentation[]
): string {
  return nodes
    .map((node) => {
      const id = `${parentId}-${node.name.toLowerCase()}`;
      let output = `${"    ".repeat(depth)}-   [\`${node.name}\`](#${id})`;
      if (node.children && depth <= 0) {
        output += "\n";
        output += generateTableOfContents(depth + 1, id, node.children);
      }
      return output;
    })
    .join("\n");
}

function generateDescriptions(
  parentName: string | undefined,
  parentId: string,
  nodes: OptionDocumentation[]
): string {
  return nodes
    .map((node) => {
      const name = parentName === undefined ? node.name : `${parentName}.${node.name}`;
      const id = `${parentId}-${node.name.toLowerCase()}`;
      let output = `### <a name="${id}"></a>\`${name}\`

${node.type === undefined ? "" : `Type: \`${node.type}\``}

${node.fullDescription}
`;
      if (node.children) {
        output += generateDescriptions(name, id, node.children);
      }
      return output;
    })
    .join("\n");
}

export function generateOptionsDocumentation(): string {
  return `## Options

${generateTableOfContents(0, "option", options)}

${generateDescriptions(undefined, "option", options)}
`;
}
