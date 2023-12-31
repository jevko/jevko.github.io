import { parseNodes, seedFromString } from "./jdaml.js"
import { resolveentities } from "./jdamlentities.js"
import { dumbconvert } from "./jdamltodom.js"

// codename for the format: znatchke


export const parseZnatchke = (str) => {
  // JDAML -> Znatchke -> render HTML
  const x = resolveZnatchke(parseNodes(seedFromString(str)))
  return dumbconvert(resolveentities(x))
}

// note: this should merge the resulting text nodes
//       so text'&[amp]othertext
//       will produce 'text&othertext'
export const resolveZnatchke = (subs) => {
  const nsubs = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      nsubs.push(sub)
    }
    else {
      const {tag, subs} = sub
      if (tag === "" || tag === "'") {
        if (subs.length !== 0) {
          const sub = subs[0]
          // [;comment]
          if (typeof sub === 'string' && sub.startsWith(';')) continue
        }
        nsubs.push(transform(subs))
      }
      else {
        nsubs.push({tag, subs: resolveZnatchke(subs)})
      }
    }
  }
  return nsubs
}

const expandattrs = (subs) => {
  const ret = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      ret.push(sub)
    }
    else {
      const {tag, subs} = sub
      if      (tag === '.c') {
        ret.push({tag: '.class', subs})
      }
      else if (tag === '.s') {
        ret.push({tag: '.style', subs})
      }
      else if (tag === '.t') {
        ret.push({tag: '.title', subs})
      }
      else {
        ret.push(sub)
      }
    }
  }
  return ret
}

// treats anon nodes as spans by default <span>...</span>
// instead of treating them as <_>...</_>
const transform = (subs_) => {
  const subs = expandattrs(subs_)

  if (subs.length === 0) {
    return {tag: "'span", subs: resolveZnatchke(subs)}
  }
  const sub = subs[0]
  if (typeof sub !== 'string') {
    return {tag: "'span", subs: resolveZnatchke(subs)}
  }

  // ?todo: a syntax to pass a string directly into output
  //        e.g.:
  // [==[html]`'
  // <a href="...">something</a>
  // '`]
  // would just write directly into the html
  // using the browser this would do something like
  // el = document.createElement('span')
  // el.outerHTML = '\n<a href="...">something</a>\n'
  // parent.append(el)

  // note: could use regexes like /^.../.test(sub) for more complex matching than .startsWith
  // note: could use [ol:...], [dl:...], etc. for more exotic things

  // ?todo: should there be any shorthands for:
  //   .class[a b c]
  //   .id[abc]

  let ret
  // ?todo: support more than 3 as well
  // ?todo: could alternatively expand [---] to &mdash; / '&[mdash]
  if (sub === '***' || sub === '---' || sub === '___') {
    if (subs.length !== 1) throw Error('oops')
    ret = {tag: "'hr", subs: []}
  }
  // ?todo: [--] -> &ndash; / '&[ndash]
  // ?todo: [...] -> &hellip; / '&[hellip]
  // br
  else if (sub === '\\') {
    if (subs.length !== 1) throw Error('oops')
    ret = {tag: "'br", subs: []}
  }
  else if (sub.startsWith('***')) {
    // ?todo: recur
    ret = {tag: "'em", subs: [{tag: "'strong", subs: [sub.slice(3), ...subs.slice(1)]}]}
  }
  else if (sub.startsWith('**')) {
    // ?todo: recur
    ret = {tag: "'strong", subs: [sub.slice(2), ...subs.slice(1)]}
  }
  else if (sub.startsWith('*')) {
    // ?todo: recur
    ret = {tag: "'em", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  else if (sub.startsWith('-')) {
    // ?todo: recur
    ret = {tag: "'del", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  else if (sub.startsWith('+')) {
    // ?todo: recur
    ret = {tag: "'ins", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  else if (sub.startsWith('_')) {
    // ?todo: recur
    ret = {tag: "'sub", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  else if (sub.startsWith('^')) {
    // ?todo: recur
    ret = {tag: "'sup", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  else if (sub.startsWith('!')) {
    // ?todo: if it has non-attribute subs we should error here
    ret = {tag: "'img", subs: [{tag: ".alt", subs: [sub.slice(1)]}, ...subs.slice(1)]}
  }
  else if (sub.startsWith('/')) {
    // ?todo: if it has non-attribute subs we should error here
    const nsubs = []
    for (const sub of subs.slice(1)) {
      if (typeof sub === 'string') nsubs.push(sub)
      else {
        const {tag, subs} = sub
        if (['.a', '.h', '.link'].includes(tag)) {
          nsubs.push({tag: '.href', subs})
        }
        else {
          nsubs.push(sub)
        }
      }
    }
    ret = {tag: "'a", subs: [sub.slice(1), ...resolveZnatchke(nsubs)]}
  }
  // block math
  // todo: actually convert -> delegate to next stage/custom converter
  else if (sub.startsWith('$$')) {
    // ?todo: recur
    // could also use tag: "'mathblock"
    ret = {tag: "'div", subs: [{tag: '.class', subs: ['math']}, sub.slice(2), ...subs.slice(1)]}
  }
  // inline math
  // todo: actually convert -> delegate to next stage/custom converter
  else if (sub.startsWith('$')) {
    // ?todo: recur
    // could also use tag: "'math"
    ret = {tag: "'span", subs: [{tag: '.class', subs: ['math']}, sub.slice(1), ...subs.slice(1)]}
  }
  // ?todo: more shorthands, e.g. [,ulist], [1.olist], [a.olist],
  // ?todo: [!image.png] or could use that for [!WARNING], etc.
  // ?todo: maybe [/http://link], [>blockquote]
  // ??todo: tasklist [-x [o ...] [x ...]]
  // ...
  // note: entity -- delegating to jdamlentities
  else if (sub.startsWith('&')) {
    // ?todo: recur
    ret = {tag: "'&", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  // escape
  else if (sub.startsWith('\\')) {
    ret = {tag: "'span", subs: [sub.slice(1), ...resolveZnatchke(subs.slice(1))]}
  }
  // [:::div]
  else if (sub.startsWith('::')) {
    ret = {tag: "'div", subs: [sub.slice(2), ...resolveZnatchke(subs.slice(1))]}
  }
  // [:emoji]
  // ?todo:
  //   https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md
  //   https://api.github.com/emojis
  else if (sub.startsWith(':')) {
    // ?todo: recur or error on children
    // todo: actually turn into emoji -> delegate to next stage/custom converter
    ret = {tag: "'span", subs: [{tag: '.class', subs: ['emoji']}, sub.slice(1), ...subs.slice(1)]}
  }
  // [=mark]
  else if (sub.startsWith('=')) {
    // ?todo: recur or error
    ret = {tag: "'mark", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  // todo: could also support = (would have to remove [=mark]) and - (would have to special case unordered lists)
  else if (sub.startsWith('#')) {
    // ?todo: recur or error
    let i = 1
    for (; i < sub.length; ++i) {
      const c = sub[i]
      if (c !== '#') {
        // todo: could save i here like `level = i` -- make this if (level === undefined && c !== '#')
        // but instead of breaking, keep going until a nonspace char is encountered
        // then text.slice(i) would effectively trimStart whitespace
        // or simply text.slice(i).trimStart() lol
        break
      }
    }
    // note: could also remove only the first space (if any)
    const text = sub.slice(i).trimStart()
    // todo: generate id from text and put it into {tag: '.id', subs: [id]}
    //       generating should remove all chars but [A-Za-z0-9] and replace spaces with -
    //       also would need to keep a set of known ids and append a numerical index
    //       if need be to make an id unique
    //       also would need a map from text -> id
    //       so that things like [@text] can be expanded into links to the proper id
    ret = {tag: `'h${i}`, subs: [text, ...subs.slice(1)]}
  }
  else if (sub.startsWith('<')) {
    // ?todo: recur or error
    let href = sub.slice(1)
    if (href.endsWith('>')) href = href.slice(0, -1)
    ret = {tag: "'a", subs: [{tag: ".href", subs: [href]}, href, ...subs.slice(1)]}
  }
  else if (sub.startsWith('\n') || sub.startsWith(' ')) {
    ret = {tag: "'p", subs: [sub.slice(1), ...resolveZnatchke(subs.slice(1))]}
  }
  else if (sub.startsWith('>\n') || sub.startsWith('> ')) {
    ret = {tag: "'blockquote", subs: [sub.slice(2), ...resolveZnatchke(subs.slice(1))]}
  }
  else if (sub.startsWith('>')) {
    ret = {tag: "'blockquote", subs: [sub.slice(1), ...resolveZnatchke(subs.slice(1))]}
  }
  // note: could also support '*' by dropping support for <em>[complex]</em> which is probably stupid anyway
  // todo: could support [-del] if rest.filter(notAnAttribute).length === 0
  //       could also support it separately as [--del]
  //       could also require list to startsWith('-\n') and there would be no conflict
  else if (sub.startsWith(',')) {
    const rest = subs.slice(1)

    const nsubs = []
    for (const sub of rest) {
      if (typeof sub === 'string') nsubs.push(sub)
      else {
        const resolved = resolveZnatchke([sub])
        const rsub = resolved[0]
        if (rsub.tag === "'span") {
          nsubs.push({tag: "'li", subs: rsub.subs})
        }
        else {
          nsubs.push({tag: "'li", subs: resolved})
        }
      }
    }
    ret = {tag: "'ul", subs: [sub.slice(1), ...nsubs]}
  }
  // ?todo: perhaps also support '.', '1.', 'a.' (for letter-numbered), etc.
  //        *  1.  1)   (1)  a.  a)  (a)  A.  A)  (A)  i.  i)  (i)  I.  I)  (I)  
  // todo: could support [+ins] if rest.filter(notAnAttribute).length === 0
  //       could also support it separately as [++ins]
  //       could also require list to startsWith('+\n') and there would be no conflict
  //
  // /^\d+\./.test(sub) -- 1.
  // /^\[a-z]+\./.test(sub) -- a.
  // etc.
  else if (sub.startsWith('.')) {
    const rest = subs.slice(1)
    const nsubs = []
    for (const sub of rest) {
      if (typeof sub === 'string') nsubs.push(sub)
      else {
        const resolved = resolveZnatchke([sub])
        const rsub = resolved[0]
        if (rsub.tag === "'span") {
          nsubs.push({tag: "'li", subs: rsub.subs})
        }
        else {
          nsubs.push({tag: "'li", subs: resolved})
        }
      }
    }
    ret = {tag: "'ol", subs: [sub.slice(1), ...nsubs]}
  }
  else if (sub.startsWith("''")) {
    // code block
    // likely require a newline after %%, optional langspec, as in %%js\n %%\n

    // todo: polish
    // ?todo: recur or error

    let ni
    for (let i = 2; i < sub.length; ++i) {
      const c = sub[i]
      if (c === '\n') {
        ni = i
        break
      }
    }
    if (ni === undefined) throw Error('newline required before code starts')
    if (sub.at(-1) !== '\n') throw Error('newline required after code ends')
    const langspec = sub.slice(2, ni)

    const nsubs = [sub.slice(ni + 1, -1)]
    if (langspec !== '') {
      // todo: actually syntaxhighlight -> delegate to next stage/custom converter
      nsubs.push({tag: '.class', subs: ['lang-' + langspec]})
    }
    nsubs.push(...subs.slice(1))
    ret = {tag: "'pre", subs: nsubs}
  }
  // ?todo: | for table as in [| [#[th][th][th]] [[td][td][td]] [[#th][td][td]] ]
  else if (sub.startsWith('|')) {
    const rest = subs.slice(1)

    // ?todo: recur

    const nsubs = [sub.slice(1)]
    for (const sub of rest) {
      if (typeof sub === 'string') {
        nsubs.push(sub)
      }
      else {
        const {tag, subs} = sub
        if (tag === '' || tag === "'") {
          const [sub0, ...rsubs] = subs
          if (typeof sub0 === 'string' && sub0.startsWith('#')) {
            const cells = []
            for (const csub of rsubs) {
              if (typeof csub === 'string') {
                cells.push(csub)
              }
              else {
                const {tag, subs} = csub
                if (tag === '' || tag === "'") {
                  cells.push({tag: "'th", subs})
                }
                else {
                  cells.push(csub)
                }
              }
            }
            nsubs.push({tag: "'tr", subs: [sub0.slice(1), ...cells]})
          }
          else {
            const cells = []
            for (const csub of subs) {
              if (typeof csub === 'string') {
                cells.push(csub)
              }
              else {
                const {tag, subs} = csub
                if (tag === '' || tag === "'") {
                  const [sub0, ...rsubs] = subs
                  if (typeof sub0 === 'string' && sub0.startsWith('#')) {
                    cells.push({tag: "'th", subs: [sub0.slice(1), ...rsubs]})
                  }
                  else {
                    cells.push({tag: "'td", subs})
                  }
                }
                else {
                  cells.push(csub)
                }
              }
            }
            nsubs.push({tag: "'tr", subs: cells})
          }
        }
        else {
          nsubs.push(sub)
        }
      }
    }

    ret = {tag: "'table", subs: nsubs}
  }
  // todo: maybe also accept ` (``) for code
  else if (sub.startsWith("'")) {
    // ?todo: recur
    ret = {tag: "'code", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  else {
    return {tag: "'span", subs: resolveZnatchke(subs)}
  }
  
  return ret
}

const trytostr = (subs) => {
  if (subs.length === 0) return ''
  if (subs.length > 1) throw Error('catch me if you can')
  const sub = subs[0]
  if (typeof sub !== 'string') throw Error('catch me if you can')
  return sub
}