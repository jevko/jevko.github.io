import { escape, smartEscape } from "./node_modules/@jevko-org/jevko.js/encode.js";

export const serializeJdaml = (subs) => {
  let ret = ''
  let prevtext = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      prevtext.push(sub)
      // ret += escape(sub)
    }
    else {
      const {tag, subs} = sub
      const etag = escape(prevtext.join('')) + escapetag(tag)
      prevtext = []
      // todo: [ = opener, ] = closer
      ret += etag + '[' + serializeJdaml(subs) + ']'
    }
  }
  return ret + smartEscape(prevtext.join(''))
}

// escapes JDAML tags -- if a tag has " \r\n\t'." we use /[<tag>]/
// todo: elaborate; perhaps disallow/escape other chars as well
const escapetag = (tag) => {
  const tag1 = tag.slice(1)
  if (tag1.matchAll(/[\r\n\t '.]/g).next().done) return escape(tag)
  return tag[0] + '/[' + smartEscape(tag1) + ']/'
}