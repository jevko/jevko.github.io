import { applyAttrs, elementDelimiter, extractData, parseNodes, seedFromString } from "./jdaml.js"
import { decodeEntity, resolveentities } from "./jdamlentities.js"
import { decodeHtmlEntity, dumbconvert } from "./jdamltodom.js"

// codename for the format: znatchke


export const parseZnatchke = (str) => {
  // JDAML -> Znatchke -> render HTML
  const x = resolveZnatchkeFlat(parseNodes(seedFromString(str)))
  return dumbconvert(resolveentities(x))
}

// todo: perhaps use this in _certain_ places to replace -- ... etc.
const processText = (str) => {
  const ret = []
  let pc = '', ppc = ''
  let j = 0
  for (let i = 0; i < str.length; ++i) {
    const c = str[i]
    if (c === '-' && pc === '-') {
      ret.push(str.slice(j, i - 1) + decodeEntity('ndash', decodeHtmlEntity))
      // ret.push({tag: elementDelimiter + "&", subs: ['ndash']})
      j = i + 1
    }
    else if (c === '.' && pc === '.' && ppc === '.') {
      ret.push(str.slice(j, i - 2) + decodeEntity('hellip', decodeHtmlEntity))
      // ret.push({tag: elementDelimiter + "&", subs: ['hellip']})
      j = i + 1
    }

    ppc = pc
    pc = c
  }
  const lastslice = str.slice(j)
  if (lastslice.length > 0) ret.push(lastslice)
  return ret
}

// todo: extract a reusable subset from this -- rn it's a bit of an overkill for the inferred headings
const createHeading = (sub, subs, secondpassdata) => {
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

  // generate id from text and put it into {tag: '.id', subs: [id]} if not defined
  const id = textToId(text, secondpassdata)

  const rsubs = subs.slice(1)

  // note: somewhat hacky perhaps
  const maybeid = []
  if (rsubs.filter(s => typeof s !== 'string' && s.tag === '.id').length === 0) {
    maybeid.push({tag: '.id', subs: [id]})
  }

  // limit to h6
  // todo: maybe warn or error or produce a class if exceeded
  let tag = elementDelimiter
  if (i > 6) tag += "h6"
  else tag += `h${i}`

  return {tag, subs: [...processText(text), ...maybeid, ...rsubs]}
}

const blocknames = [
  "p", "h1", "h2", "h3", "h4", "h5", "h6",
  "header", "hr", "ol", "ul", "dl", "li", 
  "section", "div", "pre", "blockquote", "table",

  "address", "article", "aside", "canvas", 
  "dd", "dt", "fieldset", "figcaption", "figure",
  "footer", "form", "main", "nav",
  "noscript", "tfoot", "video",

  "script", "style", "head", "body", "thead", "tbody",
]

const inlinenames = [
  "a", "abbr", "acronym", "b", "bdo", "big", "br", 
  "button", "cite", "code", "dfn", "em", "i", "img", 
  "input", "kbd", "label", "map", "object", "output", 
  "q", "samp", "script", "select", "small", "span", 
  "strong", "sub", "sup", "textarea", "time", "tt", "var",
]

// note: this needs entities to be resolved 
//       otherwise we'll get stuff like "<p>entities"</p>
//       from \&[quot]entities\&[quot]
//       instead of <p>"entities"</p>
// note: this expects that there are no consecutive text nodes 
//       (which should be assured by resolveentities)
//       -- resolveZnatchkeFlat should not mess that up
// note: we are closing paragraphs upon encountering 
//       "block" elements that we recognize; 
//       if we misrecognize some, HTML will figure it out for us
const resolveParagraphs = (subs_, secondpassdata) => {
  const subs = resolveZnatchkeFlat(subs_, secondpassdata)
  let mode = 'looking-for-paragraph'
  let prevnsubs
  let nsubs = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      let j = 0
      let cnt = 0
      let spacelen = 0
      let pc
      let i = 0
      const maybecloseparagraph = () => {
        if (cnt === 2) {
          nsubs.push(...processText(sub.slice(j, i - spacelen)))
          j = i - spacelen
          mode = 'looking-for-paragraph'
          nsubs = prevnsubs
          cnt = 0
          spacelen = 0
        }
        else {
          spacelen += 1
        }
      }
      for (; i < sub.length; ++i) {
        const c = sub[i]
        if (mode === 'looking-for-paragraph') {
          // ignore whitespace when looking for paragraph start
          if ('\n\r\t '.includes(c) === false) {
            if (c === '#') {
              mode = 'heading'
              nsubs.push(sub.slice(j, i))
              j = i
            }
            // thematic break
            else if (/^\*\*\*\s*[\n\r]/.test(sub.slice(i))) {
              nsubs.push(sub.slice(j, i))
              nsubs.push({tag: elementDelimiter + 'hr', subs: []})
              i += 3
              // note: i is now after the [\r\n]
              j = i
            }
            else {
              mode = 'paragraph'
              const subs = []
              nsubs.push(sub.slice(j, i), {tag: elementDelimiter + "p", subs})
              j = i
              prevnsubs = nsubs
              nsubs = subs
            }
          }
        }
        else if (mode === 'heading') {
          if ('\r\n'.includes(c)) {
            mode = 'looking-for-paragraph'
            // todo: full createHeading unnecessary -- no children
            nsubs.push(createHeading(sub.slice(j, i), [], secondpassdata))
            j = i
          }
        }
        else if (mode === 'paragraph') {
          if (c === '\r') {
            cnt += 1
            maybecloseparagraph()
          }
          else if (c === '\n') {
            if (pc !== '\r') {
              cnt += 1
              maybecloseparagraph()
            }
            else {
              spacelen += 1
            }
          }
          else if (cnt > 0 && '\t '.includes(c)) {
            spacelen += 1
          }
          else {
            cnt = 0
            spacelen = 0
          }
        }
        pc = c
      }
      const remainingText = sub.slice(j)
      if (mode === 'paragraph') {
        if (remainingText.length > 0) nsubs.push(...processText(remainingText))
      }
      else {
        // just space
        if (remainingText.length > 0) nsubs.push(remainingText)
      }
    }
    else {
      const {tag} = sub
      const name = tag.slice(1)
      if (
        tag.startsWith(elementDelimiter) && 
        mode === 'looking-for-paragraph' && 
        /^[a-z]/.test(name) &&
        blocknames.includes(name) === false
      ) {
        // start paragraph upon encountering non-block element
        mode = 'paragraph'
        const subs = []
        nsubs.push({tag: elementDelimiter + "p", subs})
        prevnsubs = nsubs
        nsubs = subs
      }
      else if (
        tag.startsWith(elementDelimiter) && 
        mode === 'paragraph' && 
        blocknames.includes(name)
      ) {
        // close paragraph on encountering a block element
        mode = 'looking-for-paragraph'
        nsubs = prevnsubs
      }
      nsubs.push(sub)
    }
  }
  if (mode === 'paragraph') {
    const sub = nsubs.at(-1)
    if (typeof sub === 'string') {
      // todo: unhack
      // trailing space in the last paragraph should go outside of it
      // ???-- could use spacelen for that (would have to hoist the variable, so it's visible here)
      let i = sub.length - 1
      for (; i >= 0; --i) {
        const c = sub[i]
        if ('\r\n\t '.includes(c) === false) break
      }
      i += 1
      const text = sub.slice(0, i)
      const space = sub.slice(i)
      if (space.length > 0) {
        nsubs.pop()
        nsubs.push(text)
        prevnsubs.push(space)
        // console.log(`:::${text}|${space}:::`)
      }
    }
    return prevnsubs
  }
  if (mode === 'heading') {
    // todo: mode === 'heading'
    throw Error('unimplemented')
  }
  return nsubs
}

export const resolveZnatchke = resolveParagraphs

// note: this should not emit consecutive text nodes to play nice with resolveParagraphs
// or resolveParagraphs should be made tolerant of them
const resolveZnatchkeFlat = (subs, secondpassdata = []) => {
  const nsubs = []
  let lis = []
  let litype
  for (const sub of subs) {
    if (typeof sub === 'string') {
      if (lis.length > 0) {
        if (sub.trim() === '') {
          // interleaved blank text nodes will be grouped together with the lis
          lis.push(sub)
          continue
        }
        else {
          nsubs.push({tag: elementDelimiter + litype, subs: lis})
          lis = []
          litype = undefined
        }
      }
      nsubs.push(...processText(sub))
    }
    else {
      const {tag, subs} = sub
      if (tag === "" || tag === elementDelimiter) {
        if (subs.length !== 0) {
          const sub = subs[0]
          // [;comment]
          if (typeof sub === 'string' && sub.startsWith(';')) continue
        }
        const resolved = desugar(subs, secondpassdata)
        if (Array.isArray(resolved)) nsubs.push(...resolved)
        else {
          if (resolved.litype !== undefined) {
            const listtype = resolved.litype
            if (litype === undefined) {
              litype = listtype
            }
            else if (litype !== listtype) {
              nsubs.push({tag: elementDelimiter + litype, subs: lis})
              lis = []
              litype = listtype
            }
            // tidy up
            delete resolved.litype
            lis.push(resolved)
          }
          else if (lis.length > 0) {
            nsubs.push({tag: elementDelimiter + litype, subs: lis})
            lis = []
            litype = undefined
            nsubs.push(resolved)
          }
          else {
            nsubs.push(resolved)
          }
        }
      }
      else if (tag === elementDelimiter + "-links") {
        secondpassdata.push(sub)
      }
      else if (tag === elementDelimiter + "-def") {
        // todo: ditch -links
        secondpassdata.push(sub)
      }
      else if (tag === ".$meta") {
        // note: we swallow .$meta, so no stage afterwards will see it
        secondpassdata.push(sub)
      }
      else {
        if (lis.length > 0) {
          nsubs.push({tag: elementDelimiter + litype, subs: lis})
          // if the last li is a blank text node, it should be given back to nsubs
          // ?todo: figure out if this needs to happen in other places where lis are wrapped
          const lastli = lis.at(-1)
          if (typeof lastli === 'string' && lastli.trim() === '') {
            nsubs.push(lis.pop())
          }
          lis = []
          litype = undefined
        }

        if (tag.startsWith('.')) {
          // don't resolve at all in attributes for now
          // todo: maybe for certain attributes, like alt or title it would make sense to processText
          nsubs.push({tag, subs})
        }
        // don't mess with those:
        else if (
          // scripts
          tag === elementDelimiter + 'script' ||
          // decorators
          tag.startsWith(elementDelimiter + '@')
        ) {
          nsubs.push({tag, subs})
        }
        else if (tag === elementDelimiter + '==') {
          nsubs.push(...resolveZnatchke(subs, secondpassdata))
        }
        else {
          // don't resolve paragraphs in tagged elements, but still resolve znatchke in their children that are anon elements; also processes text to substitute -- and ...
          nsubs.push({tag, subs: resolveZnatchkeFlat(subs, secondpassdata)})
        }
      }
    }
  }
  if (lis.length > 0) {
    nsubs.push({tag: elementDelimiter + litype, subs: lis})
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
// todo: perhaps support leading attributes
const desugar = (subs_, secondpassdata) => {
  const subs = expandattrs(subs_)

  if (subs.length === 0) {
    return {tag: elementDelimiter + "span", subs: resolveZnatchkeFlat(subs, secondpassdata)}
  }
  const sub = subs[0]
  if (typeof sub !== 'string') {
    return {tag: elementDelimiter + "span", subs: resolveZnatchkeFlat(subs, secondpassdata)}
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

  // todo: ?just use return? I think ret is no longer needed
  let ret
  // ?todo: support more than 3 as well
  // ?todo: could alternatively expand [---] to &mdash; / '&[mdash]
  if (sub === '***' || sub === '---' || sub === '___') {
    if (subs.length !== 1) throw Error('oops')
    ret = {tag: elementDelimiter + "hr", subs: []}
  }
  else if (sub.startsWith('\n') || sub.startsWith('\r')) {
    ret = resolveZnatchke(subs)
  }
  // ?todo: [--] -> &ndash; / '&[ndash]
  // ?todo: [...] -> &hellip; / '&[hellip]
  // ?todo: [""Hello, world!] -> &ldquo;Hello, world!&rdquo;
  // ?todo: ["'Hello, world!] -> &lsquo;Hello, world!&rsquo;
  // br
  else if (sub === '\\') {
    if (subs.length !== 1) throw Error('oops')
    ret = {tag: elementDelimiter + "br", subs: []}
  }
  else if (sub.startsWith('***')) {
    ret = {tag: elementDelimiter + "em", subs: [{tag: elementDelimiter + "strong", subs: [sub.slice(3), ...resolveZnatchkeFlat(subs.slice(1), secondpassdata)]}]}
  }
  else if (sub.startsWith('**')) {
    ret = {tag: elementDelimiter + "strong", subs: [...processText(sub.slice(2)), ...resolveZnatchkeFlat(subs.slice(1), secondpassdata)]}
  }
  else if (sub.startsWith('*')) {
    ret = {tag: elementDelimiter + "em", subs: [...processText(sub.slice(1)), ...resolveZnatchkeFlat(subs.slice(1), secondpassdata)]}
  }
  else if (sub.startsWith('-')) {
    ret = {tag: elementDelimiter + "del", subs: [...processText(sub.slice(1)), ...resolveZnatchkeFlat(subs.slice(1), secondpassdata)]}
  }
  else if (sub.startsWith('+')) {
    ret = {tag: elementDelimiter + "ins", subs: [...processText(sub.slice(1)), ...resolveZnatchkeFlat(subs.slice(1), secondpassdata)]}
  }
  else if (sub.startsWith('_')) {
    ret = {tag: elementDelimiter + "sub", subs: [...processText(sub.slice(1)), ...resolveZnatchkeFlat(subs.slice(1), secondpassdata)]}
  }
  else if (sub.startsWith('^')) {
    ret = {tag: elementDelimiter + "sup", subs: [...processText(sub.slice(1)), ...resolveZnatchkeFlat(subs.slice(1), secondpassdata)]}
  }
  else if (sub.startsWith('!')) {
    const rsubs = subs.slice(1)
    if (rsubs.some(s => typeof s !== 'string' && s.tag.startsWith(elementDelimiter))) {
      // if it has non-attribute subs we error
      throw Error(`img with children not allowed`)
    }
    // ?todo: ...processText(sub.slice(1))?
    const nsubs = [{tag: ".alt", subs: [sub.slice(1)]}]
    let hasLink = false
    for (const sub of rsubs) {
      if (typeof sub === 'string') nsubs.push(sub)
      else {
        const {tag, subs} = sub
        if (['.a', '.h', '.link'].includes(tag)) {
          if (hasLink === false) hasLink = true
          nsubs.push({tag: '.src', subs})
        }
        else {
          if (hasLink === false && tag === '.src') hasLink = true
          nsubs.push(sub)
        }
      }
    }
    ret = {tag: elementDelimiter + "img", subs: nsubs}
    if (hasLink === false) secondpassdata.push(ret)
  }
  else if (sub.startsWith('/')) {
    // ?todo: if it has non-attribute subs we should error here
    const nsubs = [sub.slice(1)]
    let hasLink = false
    for (const sub of subs.slice(1)) {
      if (typeof sub === 'string') nsubs.push(sub)
      else {
        const {tag, subs} = sub
        if (['.a', '.h', '.link'].includes(tag)) {
          if (hasLink === false) hasLink = true
          nsubs.push({tag: '.href', subs})
        }
        else {
          if (hasLink === false && tag === '.href') hasLink = true
          nsubs.push(sub)
        }
      }
    }
    ret = {tag: elementDelimiter + "a", subs: resolveZnatchkeFlat(nsubs, secondpassdata)}
    if (hasLink === false) secondpassdata.push(ret)
  }
  // block math
  // todo: actually convert -> delegate to next stage/custom converter
  else if (sub.startsWith('$$')) {
    // ?todo: recur
    // ?todo: processText?
    // could also use tag: elementDelimiter + "mathblock"
    ret = {tag: elementDelimiter + "div", subs: [{tag: '.class', subs: ['math']}, sub.slice(2), ...subs.slice(1)]}
  }
  // inline math
  // todo: actually convert -> delegate to next stage/custom converter
  else if (sub.startsWith('$')) {
    // ?todo: recur
    // ?todo: processText?
    // could also use tag: elementDelimiter + "math"
    ret = {tag: elementDelimiter + "span", subs: [{tag: '.class', subs: ['math']}, sub.slice(1), ...subs.slice(1)]}
  }
  // ?todo: more shorthands, e.g. [,ulist], [1.olist], [a.olist],
  // ?todo: maybe [/http://link], [>blockquote]
  // ??todo: tasklist [,x [o ...] [x ...]]
  // ...
  // escape
  else if (sub.startsWith('\\')) {
    ret = {tag: elementDelimiter + "span", subs: [...processText(sub.slice(1)), ...resolveZnatchkeFlat(subs.slice(1), secondpassdata)]}
  }
  // [::div]
  else if (sub.startsWith('::')) {
    // note: we resolve paragraphs inside a ::div
    const nsubs = [sub.slice(2), ...subs.slice(1)]
    ret = {tag: elementDelimiter + "div", subs: resolveZnatchke(nsubs, secondpassdata)}
  }
  // [:emoji]
  // ?todo:
  //   https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md
  //   https://api.github.com/emojis
  else if (sub.startsWith(':')) {
    // ?todo: recur or error on children
    // todo: actually turn into emoji -> delegate to next stage/custom converter
    // could work like syntax highlighting
    // -- be resolved after HTML is generated
    ret = {tag: elementDelimiter + "span", subs: [{tag: '.class', subs: ['emoji']}, sub.slice(1), ...subs.slice(1)]}
  }
  // note: removed [=mark] because it conflicts with jdamljs [=expr]
  // else if (sub.startsWith('=')) {
  //   ret = sub
  // }
  else if (sub.startsWith('#')) {
    ret = createHeading(sub, subs, secondpassdata)
  }
  else if (sub.startsWith('<')) {
    // ?todo: recur or error
    let href = sub.slice(1)
    if (href.endsWith('>')) href = href.slice(0, -1)
    ret = {tag: elementDelimiter + "a", subs: [{tag: ".href", subs: [href]}, href, ...subs.slice(1)]}
  }
  // todo: perhaps remove magic paragraphs completely -- just use \p
  else if (
    sub.startsWith('\t') || 
    sub.startsWith(' ') || 
    // little easter egg
    sub.startsWith('¶')
  ) {
    const nsubs = [sub.slice(1), ...subs.slice(1)]
    ret = {tag: elementDelimiter + "p", subs: resolveZnatchkeFlat(nsubs, secondpassdata)}
  }
  // todo: perhaps remove this and support only '>'
  else if (sub.startsWith('>\n') || sub.startsWith('> ')) {
    const subs2 = [sub.slice(2), ...subs.slice(1)]
    ret = {tag: elementDelimiter + "blockquote", subs: resolveZnatchke(subs2, secondpassdata)}
  }
  else if (sub.startsWith('>')) {
    const subs2 = [sub.slice(1), ...subs.slice(1)]
    ret = {tag: elementDelimiter + "blockquote", subs: resolveZnatchke(subs2, secondpassdata)}
  }
  // ?todo: perhaps also support '.', '1.', 'a.' (for letter-numbered), etc.
  //        *  1.  1)   (1)  a.  a)  (a)  A.  A)  (A)  i.  i)  (i)  I.  I)  (I)  
  //
  // /^\d+\./.test(sub) -- 1.
  // /^\[a-z]+\./.test(sub) -- a.
  // etc.
  // todo: instead of test + split, use match~ and assign to variable, then use that
  //       as in if (v = str.match~(/^\d+\. /))
  else if (/^\d+\.[ \r\n]/.test(sub)) {
    let [nr, text] = sub.split('.', 2)
    text = text.slice(1)
    const nsubs = [text, ...subs.slice(1)]
    // if the first line is all whitespace, we resolve paragraphs, else we don't
    const rsubs = text.split('\n', 2)[0].trim() === ''? 
      resolveZnatchke(nsubs): 
      resolveZnatchkeFlat(nsubs)
    // const rsubs = sub.includes('\n')? resolveZnatchke(nsubs): resolveZnatchkeFlat(nsubs)
    // litype marks the li to be wrapped together with siblings into a container
    ret = {litype: 'ol', tag: elementDelimiter + "li", subs: rsubs}
  }
  // note: new list implementation test
  // todo: if startsWith('.[^ ]') then only slice 1
  else if (/^\.[ \r\n]/.test(sub)) { //sub.startsWith('. ')) {
    const text = sub.slice(2)
    const nsubs = [text, ...subs.slice(1)]
    // if the first line is all whitespace, we resolve paragraphs, else we don't
    let i = 1
    for (; i < sub.length; ++i) {
      const c = sub[i]
      if ('\r\n'.includes(c)) {
        break
      }
    }
    const rsubs = i < sub.length && sub.slice(1, i).trim() === ''? 
      resolveZnatchke(nsubs): 
      resolveZnatchkeFlat(nsubs)
    // litype marks the li to be wrapped together with siblings into a container
    ret = {litype: 'ul', tag: elementDelimiter + "li", subs: rsubs}
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
      nsubs.push({tag: '.class', subs: [`lang ${langspec}`]})
    }
    nsubs.push(...subs.slice(1))
    ret = {tag: elementDelimiter + "pre", subs: nsubs}
  }
  // for table as in [| [#[th][th][th]] [[td][td][td]] [[#th][td][td]] ]
  // todo: I think support for [#[th][th][th]] can be dropped -- [[#th][#th][#th]] is enough
  else if (sub.startsWith('|')) {
    const rest = subs.slice(1)

    // ?todo: recur

    // note: as an experiment we're going to ignore text inbetween items to allow for any ascii art like + * -
    // const nsubs = [sub.slice(1)]
    const nsubs = []
    for (const sub of rest) {
      if (typeof sub === 'string') {
        // note: as an experiment we're going to ignore text inbetween items to allow for any ascii art like + * -
        // nsubs.push(sub)
      }
      else {
        // todo: perhaps don't support the [#[th][th][th]] shorthand -- just use [[#th][#th][#th]]
        const {tag, subs} = sub
        if (tag === '' || tag === elementDelimiter) {
          const [sub0, ...rsubs] = subs
          if (typeof sub0 === 'string' && sub0.startsWith('#')) {
            const cells = []
            for (const csub of rsubs) {
              if (typeof csub === 'string') {
                cells.push(csub)
              }
              else {
                // todo: simplify, the way lists are simplified, recur, processText
                const {tag, subs} = csub
                if (tag === '' || tag === elementDelimiter) {
                  cells.push({tag: elementDelimiter + "th", subs})
                }
                else {
                  cells.push(csub)
                }
              }
            }
            nsubs.push({tag: elementDelimiter + "tr", subs: [sub0.slice(1), ...cells]})
          }
          else {
            const cells = []
            for (const csub of subs) {
              if (typeof csub === 'string') {
                cells.push(csub)
              }
              else {
                const {tag, subs} = csub
                if (tag === '' || tag === elementDelimiter) {
                  const [sub0, ...rsubs] = subs
                  if (typeof sub0 === 'string' && sub0.startsWith('#')) {
                    // todo: "simplify" the way lists are simplified
                    cells.push({tag: elementDelimiter + "th", subs: [...processText(sub0.slice(1)), ...resolveZnatchkeFlat(rsubs, secondpassdata)]})
                  }
                  else {
                    cells.push({tag: elementDelimiter + "td", subs: resolveZnatchkeFlat(subs, secondpassdata)})
                  }
                }
                else {
                  cells.push(csub)
                }
              }
            }
            nsubs.push({tag: elementDelimiter + "tr", subs: cells})
          }
        }
        else {
          nsubs.push(sub)
        }
      }
    }

    ret = {tag: elementDelimiter + "table", subs: nsubs}
  }
  // todo: maybe also accept ` (``) for code
  else if (sub.startsWith("'")) {
    // ?todo: recur
    ret = {tag: elementDelimiter + "code", subs: [sub.slice(1), ...subs.slice(1)]}
  }
  else {
    return {tag: elementDelimiter + "span", subs: resolveZnatchkeFlat(subs, secondpassdata)}
  }
  
  return ret
}

const textToId = (text, secondpassdata) => {
  //       generating should remove all chars but [A-Za-z0-9] and replace spaces with -
  let sanitized = ''
  for (const c of text) {
    if (c === ' ') sanitized += '-'
    else if (
      (c >= 'A' && c <= 'Z') || 
      (c >= 'a' && c <= 'z') ||
      (c >= '0' && c <= '9') ||
      c === '-' || c === '_'
    ) sanitized += c
  }
  // note: hack
  // todo: unhack by making secondpassdata more structured
  if (secondpassdata.ids === undefined) {
    secondpassdata.ids = new Map()
    secondpassdata.textToId = new Map()
  }
  //       also would need to keep a set of known ids and append a numerical index
  //       if need be to make an id unique
  //       also would need a map from text -> id
  //       so that things like [@text] can be expanded into links to the proper id
  const {ids, textToId} = secondpassdata
  let key = sanitized
  let index = 0
  while (ids.has(key)) {
    key = sanitized + `-${index}`
    index += 1
  }
  ids.set(key, text)
  textToId.set(text, key)
  return key
}

// note: as a hack, we're gonna mutate here
export const znatchkesecondpass = async (resolved, secondpassdata) => {
  // first we'll assemble info
  let meta
  const linkmap = new Map()
  const imgmap = new Map()
  const linkstoconnect = new Map()
  const imgstoconnect = new Map()
  // todo: handle duplicate/conflicting links; e.g. autogenerated links for headings vs same keys explicitly defined
  for (const sub of secondpassdata) {
    const {tag, subs} = sub
    if (tag === elementDelimiter + "-links") {
      const resolved = resolveZnatchkeFlat(subs)
      for (const sub of resolved) {
        if (typeof sub === 'string') continue
        const {tag, subs} = sub
        if (tag === elementDelimiter + "a") {
          // note: naively for now we'll assume that subs are [linktext, href]
          // todo: don't assume that
          const [first, ...rest] = subs
          linkmap.set(first, rest)
        }
        else if (tag === elementDelimiter + "img") {
          // note: naively for now we'll assume that subs are [.alt, .src]
          // todo: don't assume that
          const [first, ...rest] = subs
          const {tag, subs: ss} = first
          if (tag !== '.alt') throw Error('wrong assumption')
          // note: naively for now we'll assume that .alt is just [text]
          const [key] = ss
          imgmap.set(key, rest)
        }
        else {
          console.error('>>', typeof sub, sub)
          throw Error('oops: unrecognized/unimplemented')
        }
      }
    }
    else if (tag === elementDelimiter + '-def') {
      const resolved = resolveZnatchkeFlat(subs)
      for (const sub of resolved) {
        if (typeof sub === 'string') continue
        const {tag, subs} = sub
        if (tag === elementDelimiter + "a") {
          // note: naively for now we'll assume that subs are [linktext, href]
          // todo: don't assume that
          const [first, ...rest] = subs
          linkmap.set(first, rest)
        }
        else if (tag === elementDelimiter + "img") {
          // note: naively for now we'll assume that subs are [.alt, .src]
          // todo: don't assume that
          const [first, ...rest] = subs
          const {tag, subs: ss} = first
          if (tag !== '.alt') throw Error('wrong assumption')
          // note: naively for now we'll assume that .alt is just [text]
          const [key] = ss
          imgmap.set(key, rest)
        }
        else {
          console.error('>>', typeof sub, sub)
          throw Error('oops: unrecognized/unimplemented')
        }
      }
    }
    else if (tag === ".$meta") {
      // oof:
      meta = extractData(applyAttrs(resolveentities(subs)))
    }
    else if (tag === elementDelimiter + "a") {
      // note: naively for now we'll assume that subs are [linktext, href]
      // todo: don't assume that
      const [first, ..._rest] = subs
      linkstoconnect.set(first, sub)
    }
    else if (tag === elementDelimiter + "img") {
      // note: naively for now we'll assume that subs are [.alt, .src]
      // todo: don't assume that
      const [first, ..._rest] = subs
      const {tag, subs: ss} = first
      if (tag !== '.alt') throw Error('wrong assumption')
      // note: naively for now we'll assume that .alt is just [text]
      const [key] = ss
      imgstoconnect.set(key, sub)
    }
    else {
      // todo: support img links too
      console.error(sub)
      throw Error('oops: unrecognized/unimplemented')
    }
  }
  console.log(">::linkstoconnect", linkstoconnect, linkmap)

  // then we'll connect things up, insert what's to be inserted, etc. according to the info collected
  for (const [key, link] of linkstoconnect) {
    // note: let's say linkmap has precedence over textToId
    // todo: figure it out
    if (linkmap.has(key)) {
      const attrs = linkmap.get(key)
      // note: naively for now we'll assume that subs are [linktext, href]
      // todo: don't assume that
      link.subs.push(...attrs)
    }
    else if (secondpassdata?.textToId?.has(key)) {
      link.subs.push({tag: '.href', subs: [`#${secondpassdata.textToId.get(key)}`]})
    }
    else {
      // todo: perhaps this should only be a warning
      console.warn(key, link)
      console.warn(`link without target: ${key}`)
      throw Error(`link without target: ${key}`)
    }
  }
  for (const [key, img] of imgstoconnect) {
    if (imgmap.has(key)) {
      const attrs = imgmap.get(key)
      // note: naively for now we'll assume that subs are [linktext, href]
      // todo: don't assume that
      img.subs.push(...attrs)
    }
    else {
      console.warn(key, img)
      console.warn(`img without target: ${key}`)
      throw Error(`img without target: ${key}`)
    }
  }

  // todo: the rest
  console.log('>>>>meta', meta)
  if (meta !== undefined) {
    const elemstoprepend = []
    // find or create head, so it can be manipulated
    let head
    for (const sub of resolved) {
      if (typeof sub !== 'string' && sub.tag === elementDelimiter + "head") {
        head = sub
        break
      }
    }
    if (head === undefined) {
      head = {tag: elementDelimiter + "head", subs: []}
      elemstoprepend.push(head)
    }
    // todo: figure out if this is the right place to append this
    head.subs.push({tag: elementDelimiter + 'meta', subs: [{tag: '.charset', subs: ['utf-8']}]})
    head.subs.push({tag: elementDelimiter + 'meta', subs: [
      {tag: '.name', subs: ['viewport']},
      {tag: '.content', subs: ['width=device-width, initial-scale=1.0, user-scalable=yes']},
    ]})
    head.subs.push({tag: elementDelimiter + 'meta', subs: [
      {tag: '.name', subs: ['generator']},
      {tag: '.content', subs: ['znatchke']},
    ]})

    if (meta.head !== undefined) {
      const res = await fetch(meta.head)
      const text = await res.text()
      const subs = parseNodes(seedFromString(text), resolveentities)
      const nodes = resolveentities(subs, decodeHtmlEntity)
      head.subs.push(...nodes)
    }

    if (meta.before !== undefined) {
      const res = await fetch(meta.before)
      const text = await res.text()
      const subs = parseNodes(seedFromString(text), resolveentities)
      const nodes = resolveentities(subs, decodeHtmlEntity)
      elemstoprepend.push(...nodes)
    }

    const headersubs = []
    if (meta.title !== undefined) {
      headersubs.push({tag: elementDelimiter + "h1", subs: [...processText(meta.title), {tag: '.class', subs: ['title']}]}, '\n')

      head.subs.push({tag: elementDelimiter + "title", subs: [...processText(meta.title)]})
    }
    if (meta.author !== undefined) {
      const ptext = processText(meta.author)
      // todo: allow multiple authors
      headersubs.push({tag: elementDelimiter + "p", subs: [...ptext, {tag: '.class', subs: ['author']}]}, '\n')

      // <meta name="author" content="${author}" />
      head.subs.push({tag: elementDelimiter + 'meta', subs: [
        {tag: '.name', subs: ['author']},
        {tag: '.content', subs: ptext},
      ]})
    }
    if (meta.date !== undefined) {
      headersubs.push({tag: elementDelimiter + "p", subs: [meta.date, {tag: '.class', subs: ['date']}]}, '\n')

      // <meta name="dcterms.date" content="${date}" />
      head.subs.push({tag: elementDelimiter + 'meta', subs: [
        {tag: '.name', subs: ['dcterms.date']},
        {tag: '.content', subs: [meta.date]},
      ]})
    }
    // todo: support meta.description,keywords,subtitle,abstract,toc

    if (headersubs.length > 0) {
      headersubs.push({tag: '.id', subs: ['znatchke-header']})
      elemstoprepend.push({tag: elementDelimiter + "header", subs: headersubs})
    }

    if (meta.after !== undefined) {
      const res = await fetch(meta.after)
      const text = await res.text()
      const subs = parseNodes(seedFromString(text), resolveentities)
      const nodes = resolveentities(subs, decodeHtmlEntity)
      resolved.push(...nodes)
    }

    resolved.unshift(...elemstoprepend)
  }
}