import { elementDelimiter } from "./jdaml.js";

const entitymap = new Map([
  // XML entities
  ['apos', "'"],
  ['quot', '"'],
  ['lt', '<'],
  ['gt', '>'],
  ['amp', '&'],

  // JSON escape sequences as entities
  ['/', '/'],
  ['\\', '\\'],
  ['"', '"'],
  ['b', '\b'],
  ['f', '\f'],
  ['n', '\n'],
  ['r', '\r'],
  ['t', '\t'],

  // some HTML5 entities
  ['lsqb', '['],
  ['lbrack', '['],
  ['bsol', '\\'],
  ['period', '.'],
  ['rsqb', ']'],
  ['rbrack', ']'],
  ['grave', '`'],

  ['nbsp', '\u00A0'], // no-break space

  ['para', '\u00B6'], // pilcrow sign (paragraph sign) ¶
  ['sect', '\u00A7'], // section sign §
  ['copy', '©'], // copyright symbol

  ['laquo', '\u00AB'], // «
  ['raquo', '\u00BB'], // »

  ['hyphen', '\u2010'], // ‐
  ['dash', '\u2010'], // ‐
  ['ndash', '\u2013'], // –
  ['mdash', '\u2014'], // — 
  ['horbar', '\u2015'], // ―
  ['hellip', '…'],
  ['mldr', '…'],
  ['lsquo', '\u2018'], // ‘
  ['rsquo', '\u2019'], // ’
  ['ldquo', '\u201C'], // “
  ['rdquo', '\u201D'], // ”
])

const errorDecoder = (entity) => {
  throw new SyntaxError(`Unrecognized entity: \\&[${entity}]`)
}

// note: could support \&[r;n] as a shorthand for \&[r]\&[n]
//       any number of consecutive entites could be allowed, e.g.
//       \&[r;n;t;lsquo;rsquo]
export const decodeEntity = (entity, externalDecoder) => {
  if (entitymap.has(entity)) return entitymap.get(entity)
  if (entity.startsWith('#')) {
    const rest = entity.slice(1)
    // todo: perhaps error if entity doesn't conform to the regexp:
    // /[#A-Za-z0-9]+/
    // or:
    // /#x[a-fA-F0-9]+|#[0-9]+|[a-zA-Z0-9]+/
    if (rest.startsWith('x')) {
      const numstr = rest.slice(1)
      // todo: regexp to check that numstr is a valid hex number/codepoint
      return String.fromCodePoint(+numstr)
    }
    else {
      // todo: regexp to check that numstr is a valid decimal number/codepoint
      return String.fromCodePoint(+rest)
    }
  }
  return externalDecoder(entity)
}

const trytostr = (subs, externalDecoder) => {
  if (subs.length === 0) return ''
  if (subs.length > 1) throw Error('catch me if you can')
  const sub = subs[0]
  if (typeof sub !== 'string') throw Error('catch me if you can')
  return decodeEntity(sub, externalDecoder)
}

// note: this should merge the resulting text nodes
//       so text'&[amp]othertext
//       will produce 'text&othertext'
export const resolveentities = (subs, externalDecoder = errorDecoder) => {
  let prevtext = []
  const nsubs = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      prevtext.push(sub)
    }
    else {
      const {tag, subs} = sub
      if (tag === elementDelimiter + "&") {
        prevtext.push(trytostr(subs, externalDecoder))
      }
      else {
        if (prevtext.length > 0) {
          nsubs.push(prevtext.join(''))
          prevtext = []
        }
        nsubs.push({tag, subs: resolveentities(subs, externalDecoder)})
      }
    }
  }
  if (prevtext.length > 0) nsubs.push(prevtext.join(''))
  return nsubs
}
