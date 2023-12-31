export const language = {
  id: 'jdaml',
  extensions: ['.jdaml', '.jdml'],
  aliases: ['JDAML', 'jdaml'],
  mimetypes: ['text/jdaml'],
  // firstLine: "^#!.*\\bnode",
  firstLine: "^\\.:format",
}
export const configuration = {
  brackets: [
    ['[', ']']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "`", close: "`" },
  ],
}

export const tokensProvider = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: 'invalid',
  tokenPostfix: ".jdaml",

  brackets: [
    ['[',']','delimiter.square'],
  ],

  outdentTriggers: ']',

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      {include: 'jevko'},
    ],
    jevko: [
      // attributes with arbitrary names
      [/(\.)(\/\[)/, ['attribute.name', {token: 'regexp', bracket: '@open', next: '@attrn.attribute'}]],
      // elements with arbitrary names
      [/(')(\/\[)/, ['tag.name', {token: 'regexp', bracket: '@open', next: '@tagn.tag'}]],

      // regular .attributes
      [/(\.[a-zA-Z_0-9\-$]+)(\[)/, ['attribute.name', {token: '@brackets', next: '@jevko.attrib'}]],
      // anonymous elements
      [/('?)(\[)/, ['tag.name', {token: '@brackets', next: '@jevko.anon'}]],
      // '=[] and '&
      [/('[&=])(\[)/, ['tag.name', {token: '@brackets', next: '@jevko.anon'}]],
      // regular 'elements
      [/('[a-zA-Z_0-9\-$]+)(\[)/, ['tag.name', {token: '@brackets', next: '@jevko'}]],
      [/(\.|');[a-zA-Z_-]*\[/, 'comment', '@comment'],
      // { include: '@whitespace' },
      // invalid 'attributes
      [/(\.[^.' \r\n\t\[\]`]+)(\[)/, ['invalid', {token: '@brackets', next: '@jevko.attrib'}]],
      // invalid 'elements
      [/('[^.' \r\n\t\[\]`]+)(\[)/, ['invalid', {token: '@brackets', next: '@jevko'}]],
      // closing bracket
      [/\]/, { token: '@brackets', next: '@pop' } ],


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

    comment: [
      [/\[/, { token: 'comment', bracket: '@open', next: '@comment' } ],
      [/\]/, { token: 'comment', bracket: '@close', next: '@pop' } ],
      [/((``)*`)'/,  { token: 'delimiter.comment.$1', bracket: '@open', next: '@string_fenced.$1.comment' } ],
      [/`\/([a-zA-Z0-9_]*)\//,  { token: 'delimiter.comment.$1', bracket: '@open', next: '@string_tagged.$1.comment' } ],
      [/./, 'comment']
    ],

    string_fenced: [
      [/'(`(?:``)*)(?=\[|\])/, {
        cases: {
          "$S2==$1": { token: 'delimiter.$S3.$1', bracket: '@close', next: '@pop' }
        }
      }],
      [/./, {token: 'string.$S3'}],
    ],
    string_tagged: [
      [/\/([a-zA-Z0-9_$]*)\/(?=\[|\])/, {
        cases: {
          "$S2==$1": { token: 'delimiter.$S3.$1', bracket: '@close', next: '@pop' }
        }
      }],
      [/./, {token: 'string.$S3'}],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
    ],
  },
}

export const theme = {
  colors: {
    // 'editor.background': '#000000',
  },
  base: 'vs-dark',
  inherit: true,
  rules: [
    { background: '#1f1f1f', foreground: '#cccccc' },
    // { token: '', foreground: '#cccccc' },
    { token: 'invalid', foreground: '#f44747' },
    { token: 'delimiter', foreground: '#808080' },
    { token: 'delimiter.normal', foreground: '#808080' },
    { token: 'comment', foreground: '#608b4e' },
    { token: 'string.comment', foreground: '#608b4e' },
    { token: 'delimiter.comment', foreground: '#608b4e' },
    { token: 'string', foreground: '#ce9178' },
    { token: 'string.escape', foreground: '#fbcab6' },
    // note: not sure which is the right color for anon nodes
    // { token: 'string.anon', foreground: '#fbcab6' },
    // { token: 'string.anon', foreground: '#ce9178' },
    { token: 'string.anon', foreground: '#cccccc' },
    { token: 'regexp', foreground: '#b46695' },
    { token: 'bracket', foreground: '#ffd700' },
    { token: 'attribute.name', foreground: '#9cdcfe' },
    // todo: rename to something like string.attributename
    //       will have to change @attrn.attribute to @attrn.attributename
    { token: 'string.attribute', foreground: '#9cdcfe' },
    // todo: rename to something like string.escape.attributename
    //       will have to change @attrn.attribute to @attrn.attributename
    { token: 'string.escape.attribute', foreground: '#ccffff' },
    { token: 'tag', foreground: '#569cd6' },
    // todo: rename to something like string.tagname or string.elementname
    //       will have to change @tagn.tag to @tagn.tagname / @tagn.elementname
    //       maybe also rename @tagn to @elementname
    { token: 'string.tag', foreground: '#569cd6' },
    // todo: rename to something like string.escape.tagname or string.escape.elementname
    //       will have to change @tagn.tag to @tagn.tagname / @tagn.elementname
    //       maybe also rename @tagn to @elementname or @elemn
    { token: 'string.escape.tag', foreground: '#ccffff' },
    { token: 'string.', foreground: '#cccccc' },
    // todo: after renaming attributename, rename to something like string.attribute
    //       or string.attributevalue
    //       will have to change @jevko.attrib to @jevko.attribute / @jevko.attributevalue
    { token: 'string.attrib', foreground: '#ce9178' },

    { token: 'keyword.json', foreground: '#569cd6' },
    // { token: 'delimiter', foreground: '#ffd700' },
    // { token: 'attribute', foreground: '#9cdcfe' },
  ]
}