const makeCommon = (maybeprop = false) => [
  [
    /#?[a-z_$][\w$]*/,
    {
      cases: {
        "@keywords": "keyword",
        "@default": "identifier"
      }
    }
  ],
  [/[A-Z][\w\$]*/, "type.identifier"],
  { include: "@whitespace" },
  [
    /\/(?=([^\\\/]|\\.)+\/([dgimsuy]*)(\s*)(\.|;|,|\)|\]|\}|$))/,
    { token: "regexp", bracket: "@open", next: "@regexp" }
  ],
  [/\[/, {token: '@brackets', next: '@push'}],
  maybeprop? 
    [/\]/, {token: '@brackets', switchTo: '@maybeprop'}]: 
    [/\]/, {token: '@brackets', next: '@pop'}],
  [/[(){}]/, "@brackets"],
  // [/[()\[\]]/, "@brackets"],
  [/[<>](?!@symbols)/, "@brackets"],
  [/!(?=([^=]|$))/, "delimiter"],
  [
    /@symbols/,
    {
      cases: {
        "@operators": "delimiter",
        "@default": ""
      }
    }
  ],
  [/(@digits)[eE]([\-+]?(@digits))?/, "number.float"],
  [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, "number.float"],
  [/0[xX](@hexdigits)n?/, "number.hex"],
  [/0[oO]?(@octaldigits)n?/, "number.octal"],
  [/0[bB](@binarydigits)n?/, "number.binary"],
  [/(@digits)n?/, "number"],
  [/[;,.]/, "delimiter"],
  [/"([^"\\]|\\.)*$/, "string.invalid"],
  [/'([^'\\]|\\.)*$/, "string.invalid"],
  [/"/, "string", "@string_double"],
  [/'/, "string", "@string_single"],
  [/`/, "string", "@string_backtick"],
  {include: 'jdamltriggers'}
]

export const conf = {
  wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  onEnterRules: [
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: {
        // todo:
        // indentAction: monaco_editor_core_exports.languages.IndentAction.IndentOutdent,
        appendText: " * "
      }
    },
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      action: {
        // todo:
        // indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: " * "
      }
    },
    {
      beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
      action: {
        // todo:
        // indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        appendText: "* "
      }
    },
    {
      beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
      action: {
        // todo:
        // indentAction: monaco_editor_core_exports.languages.IndentAction.None,
        removeText: 1
      }
    }
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "/**", close: " */", notIn: ["string"] }
  ],
  folding: {
    markers: {
      start: new RegExp("^\\s*//\\s*#?region\\b"),
      end: new RegExp("^\\s*//\\s*#?endregion\\b")
    }
  }
};
export const language = {
  defaultToken: "invalid",
  tokenPostfix: ".ts",
  keywords: [
    "abstract",
    "any",
    "as",
    "asserts",
    "bigint",
    "boolean",
    "break",
    "case",
    "catch",
    "class",
    "continue",
    "const",
    "constructor",
    "debugger",
    "declare",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "get",
    "if",
    "implements",
    "import",
    "in",
    "infer",
    "instanceof",
    "interface",
    "is",
    "keyof",
    "let",
    "module",
    "namespace",
    "never",
    "new",
    "null",
    "number",
    "object",
    "out",
    "package",
    "private",
    "protected",
    "public",
    "override",
    "readonly",
    "require",
    "global",
    "return",
    "satisfies",
    "set",
    "static",
    "string",
    "super",
    "switch",
    "symbol",
    "this",
    "throw",
    "true",
    "try",
    "type",
    "typeof",
    "undefined",
    "unique",
    "unknown",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "async",
    "await",
    "of"
  ],
  operators: [
    "<=",
    ">=",
    "==",
    "!=",
    "===",
    "!==",
    "=>",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%",
    "++",
    "--",
    "<<",
    "</",
    ">>",
    ">>>",
    "&",
    "|",
    "^",
    "!",
    "~",
    "&&",
    "||",
    "??",
    "?",
    ":",
    "=",
    "+=",
    "-=",
    "*=",
    "**=",
    "/=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "@"
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[0-1]+(_+[0-1]+)*/,
  hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,
  tokenizer: {
    root: [[/[{}]/, "delimiter.bracket"], { include: "jevko" }],
    common: makeCommon(),
    common2: makeCommon(true),
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^\/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[\/*]/, "comment"]
    ],
    jsdoc: [
      [/[^\/*]+/, "comment.doc"],
      [/\*\//, "comment.doc", "@pop"],
      [/[\/*]/, "comment.doc"]
    ],
    regexp: [
      [
        /(\{)(\d+(?:,\d*)?)(\})/,
        ["regexp.escape.control", "regexp.escape.control", "regexp.escape.control"]
      ],
      [
        /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/,
        ["regexp.escape.control", { token: "regexp.escape.control", next: "@regexrange" }]
      ],
      [/(\()(\?:|\?=|\?!)/, ["regexp.escape.control", "regexp.escape.control"]],
      [/[()]/, "regexp.escape.control"],
      [/@regexpctl/, "regexp.escape.control"],
      [/[^\\\/]/, "regexp"],
      [/@regexpesc/, "regexp.escape"],
      [/\\\./, "regexp.invalid"],
      [/(\/)([dgimsuy]*)/, [{ token: "regexp", bracket: "@close", next: "@pop" }, "keyword.other"]]
    ],
    regexrange: [
      [/-/, "regexp.escape.control"],
      [/\^/, "regexp.invalid"],
      [/@regexpesc/, "regexp.escape"],
      [/[^\]]/, "regexp"],
      [
        /\]/,
        {
          token: "regexp.escape.control",
          next: "@pop",
          bracket: "@close"
        }
      ]
    ],
    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"]
    ],
    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, "string", "@pop"]
    ],
    bracketCounting: [
      [/\{/, "delimiter.bracket", "@bracketCounting"],
      [/\}/, "delimiter.bracket", "@pop"],
      { include: "common" }
    ],

    //
    // jdaml tokens
    //
    // todo: keep up to date with jevko
    //       probably use {include: 'jdamltriggers'} in jevko
    // todo: rename jevko to jdaml
    jdamltriggers: [
      // sigils
      [/(\\)(\[)(\d*\.)/, ['delimiter', {token: '@brackets', next: '@jevko'}, 'string.bold']],
      
      // elements with arbitrary names
      [/(\\)(\/\[)/, ['delimiter', {token: 'regexp', bracket: '@open', next: '@tagn.tag'}]],
      // shorthand for JS in JDAML
      [/(\\?)(\[)(=)/, ['delimiter', {token: '@brackets', next: '@common'}]],
      // anonymous elements
      [/(\\?)(\[)/, ['delimiter', {token: '@brackets', next: '@jevko.anon'}]],
      // string-representing elements
      [/(\\)(')(\[)/, ['delimiter', 'tag.special.name', {token: '@brackets', next: '@jevko.attrib'}]],
      // '=[] and '&
      [/(\\)([&=])(\[)/, ['delimiter', 'tag.name', {token: '@brackets', next: '@jevko.anon'}]],
      // shorthand for JS in JDAML
      // todo: this should next to @common2 which is like common, except on ] it switches to maybeprop
      [/(\\)([a-zA-Z_0-9\-$]+)(\[)(=)/, ['delimiter', 'tag.name', {token: '@brackets', next: '@common2'}, 'delimiter']],
      // regular 'elements
      [/(\\)([a-zA-Z_0-9\-$]+)(\[)/, ['delimiter', 'tag.name', {token: '@brackets', next: '@jevko'}]],
      // special elements
      [/(\\[:=@])([a-zA-Z_0-9\-$]+)(\[)/, ['delimiter', 'tag.special.name', {token: '@brackets', next: '@jevko'}]],
      // comments
      [/(\\);[a-zA-Z_-]*\[/, 'comment', '@jdamlcomment'],
      // invalid 'elements
      [/(\\[^.\\ \r\n\t\[\]`]+)(\[)/, ['invalid', {token: '@brackets', next: '@jevko'}]],

      // escaped attrs
      // todo:
      [/(\\)(\.)([a-zA-Z_0-9\-$]+)(\[)/, ['delimiter', 'delimiter', 'attribute.name', {token: '@brackets', next: '@jevko.attrib'}]],
    ],
    maybeprop: [
      [/[ \t\r\n]+/, ""],
      [/(\.)([a-zA-Z_0-9\-$]+)(\[)(=)/, ['delimiter', 'attribute.name', {token: '@brackets', next: '@common'}, 'delimiter']],
      [/(\.)([a-zA-Z_0-9\-$]+)(\[)/, ['delimiter', 'attribute.name', {token: '@brackets', next: '@jevko.attrib'}]],
      [/./, {token: '@rematch', next: '@pop'}],
    ],
    jevko: [
      // attributes with arbitrary names
      [/(\.)(\/\[)/, ['delimiter', {token: 'regexp', bracket: '@open', next: '@attrn.attribute'}]],
      // elements with arbitrary names
      [/(\\)(\/\[)/, ['delimiter', {token: 'regexp', bracket: '@open', next: '@tagn.tag'}]],

      // shorthand for JS in JDAML
      [/(\.)([a-zA-Z_0-9\-$]+)(\[)(=)/, ['delimiter', 'attribute.name', {token: '@brackets', next: '@common'}, 'delimiter']],

      // regular .attributes
      [/(\.)([a-zA-Z_0-9\-$]+)(\[)/, ['delimiter', 'attribute.name', {token: '@brackets', next: '@jevko.attrib'}]],
      // meta attributes
      [/(\.:)([a-zA-Z_0-9\-$]+)(\[)/, ['delimiter', 'attribute.meta.name', {token: '@brackets', next: '@jevko.attrib'}]],
      // shorthand for JS in JDAML
      [/(\[)(=)/, [{token: '@brackets', next: '@common'}, 'delimiter']],
      // znatchke sigils
      // todo: separate Monaco language for znatchke
      [/^\s*#+.*/, 'heading'],
      [/(\\?)(\[)(?=\#)/, ['delimiter', {token: '@brackets', next: '@jevko.bold'}]],
      // todo: dedicated @jevko.code + color same as .attrib
      [/(\\?)(\[)(?=\')/, ['delimiter', {token: '@brackets', next: '@jevko.attrib'}]],
      [/(\\?)(\[)(?=\*\*)/, ['delimiter', {token: '@brackets', next: '@jevko.bold'}]],
      [/(\\?)(\[)(?=\.\.\.)/, ['delimiter', {token: '@brackets', next: '@jevko.anon'}]],
      [/(\\?)(\[)(\d*\. )/, ['delimiter', {token: '@brackets', next: '@jevko'}, 'string.bold']],
      [/(\\?)(\[)(?=,|\|)/, ['delimiter', {token: '@brackets', next: '@jevko.bold'}]],
      [/(\\?)(\[)(?=\*)/, ['delimiter', {token: '@brackets', next: '@jevko.italic'}]],
      [/(\\?)(\[)(?=\/|<|!)/, ['delimiter', {token: '@brackets', next: '@jevko.link'}]],
      // anonymous elements
      [/(\\?)(\[)/, ['delimiter', {token: '@brackets', next: '@jevko.anon'}]],
      // string-representing elements
      [/(\\)(')(\[)/, ['delimiter', 'tag.special.name', {token: '@brackets', next: '@jevko.attrib'}]],
      // splat
      [/(\\)(==)(\[)/, ['delimiter', 'tag.special.name', {token: '@brackets', next: '@jevko.anon'}]],
      // JS-containing elements (build time)
      [/(\\@?)([=-])(\[)/, ['delimiter', 'tag.special.name', {token: '@brackets', next: '@common'}]],
      // JS-containing elements (runtime)
      [/(\\)(script)(\[)/, ['delimiter', 'tag.special.name', {token: '@brackets', next: '@common'}]],
      // entity-representing elements \&
      [/(\\)(&)(\[)/, ['delimiter', 'tag.name', {token: '@brackets', next: '@jevko.anon'}]],
      // shorthand for JS in JDAML
      [/(\\)([a-zA-Z_0-9\-$]+)(\[)(=)/, ['delimiter', 'tag.name', {token: '@brackets', next: '@common'}, 'delimiter']],
      // regular \elements
      [/(\\)([a-zA-Z_0-9\-$]+)(\[)/, ['delimiter', 'tag.name', {token: '@brackets', next: '@jevko'}]],
      // decorators
      // todo: deduplicate, maybe dedicated coloring
      [/(\\@)([a-zA-Z_0-9\-$]*)(\[)/, ['delimiter', 'tag.special.name', {token: '@brackets', next: '@jevko.attrib'}]],
      // special \elements
      [/(\\[:=])([a-zA-Z_0-9\-$]+)(\[)/, ['delimiter', 'tag.special.name', {token: '@brackets', next: '@jevko'}]],
      // comments
      [/(\.|\\);[a-zA-Z_0-9\-$]*\[/, 'comment', '@jdamlcomment'],
      // { include: '@whitespace' },
      // invalid 'attributes
      [/(\.[^.\\ \r\n\t\[\]`]+)(\[)/, ['invalid', {token: '@brackets', next: '@jevko.attrib'}]],
      // invalid 'elements
      [/(\\(?:[^.\\ \r\n\t\[\]`]+))(\[)/, ['invalid', {token: '@brackets', next: '@jevko'}]],
      // closing bracket
      [/\]/, { token: '@brackets', switchTo: '@maybeprop' } ],


      // fenced strings
      [/((``)*`)'/,  { token: 'delimiter.normal.$1', bracket: '@open', next: '@string_fenced.$1.$S2' } ],
      // tagged strings
      [/`\/([a-zA-Z0-9_]*)\//,  { token: 'delimiter.normal.$1', bracket: '@open', next: '@string_tagged.$1.$S2' } ],

      // escapes
      [/`(`|\[|\])/, {token: 'string.escape.$S2'}],
      // brackets
      [/[\[\]]/, '@brackets'],
      [/[^\]\[`]+?/, {token: 'string.$S2'}],
    ],

    attrn: [
      [/\]/, { token: 'regexp', bracket: '@close', switchTo: '@attrx' } ],
      {include: 'jevko'},
    ],
    attrx: [
      [/(\/)(\[)/, ['regexp', { token: 'delimiter.square', switchTo: '@jevko.attrib' }]]
    ],

    tagn: [
      [/\]/, { token: 'regexp', bracket: '@close', switchTo: '@tagx' } ],
      {include: 'jevko'},
    ],
    tagx: [
      [/(\/)(\[)/, ['regexp', { token: 'delimiter.square', switchTo: '@jevko' }]]
    ],

    jdamlcomment: [
      [/\[/, { token: 'comment', bracket: '@open', next: '@push' } ],
      [/\]/, { token: 'comment', bracket: '@close', next: '@pop' } ],
      [/((``)*`)'/,  { token: 'delimiter.comment.$1', bracket: '@open', next: '@string_fenced.$1.comment' } ],
      [/`\/([a-zA-Z0-9_]*)\//,  { token: 'delimiter.comment.$1', bracket: '@open', next: '@string_tagged.$1.comment' } ],
      [/./, 'comment']
    ],

    string_fenced: [
      [/'(`(?:``)*)(?=\[|\])/, {
        cases: {
          "$S2==$1": { token: 'delimiter.$S3.$1', bracket: '@close', next: '@pop' },
          '@default': {token: 'string.$S3'},
        }
      }],
      [/./, {token: 'string.$S3'}],
    ],
    string_tagged: [
      [/\/([a-zA-Z0-9_$]*)\/(?=\[|\])/, {
        cases: {
          "$S2==$1": { token: 'delimiter.$S3.$1', bracket: '@close', next: '@pop' },
          '@default': {token: 'string.$S3'},
        }
      }],
      [/./, {token: 'string.$S3'}],
    ],
  }
};

  // src/basic-languages/javascript/javascript.ts
export const conf2 = conf;
export const language2 = {
  defaultToken: "invalid",
  tokenPostfix: ".js",
  keywords: [
    "break",
    "case",
    "catch",
    "class",
    "continue",
    "const",
    "constructor",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "from",
    "function",
    "get",
    "if",
    "import",
    "in",
    "instanceof",
    "let",
    "new",
    "null",
    "return",
    "set",
    "static",
    "super",
    "switch",
    "symbol",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "undefined",
    "var",
    "void",
    "while",
    "with",
    "yield",
    "async",
    "await",
    "of"
  ],
  typeKeywords: [],
  operators: language.operators,
  symbols: language.symbols,
  escapes: language.escapes,
  digits: language.digits,
  octaldigits: language.octaldigits,
  binarydigits: language.binarydigits,
  hexdigits: language.hexdigits,
  regexpctl: language.regexpctl,
  regexpesc: language.regexpesc,
  tokenizer: language.tokenizer
};

export const languagereg = {
  id: 'jsjdaml',
  extensions: ['.jsj', '.jjs'],
  // aliases: ['JDAML', 'jdaml'],
  mimetypes: ['text/jdaml+javascript'],
  // firstLine: "^#!.*\\bnode",
  firstLine: "^\\.:format",
}