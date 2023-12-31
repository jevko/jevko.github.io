const decodeEntity = (() => {
  var tarea = document.createElement("textarea");
  // todo: perhaps error if entity doesn't conform to the regexp:
  // /[#A-Za-z0-9]+/
  // or:
  // /#x[a-fA-F0-9]+|#[0-9]+|[a-zA-Z0-9]+/
  return (entity) => {
    tarea.innerHTML = '&' + entity + ';';
    return tarea.value;
  }
})()

const trytostr = (subs) => {
  if (subs.length === 0) return ''
  if (subs.length > 1) throw Error('catch me if you can')
  const sub = subs[0]
  if (typeof sub !== 'string') throw Error('catch me if you can')
  return decodeEntity(sub)
}

// note: this should merge the resulting text nodes
//       so text'&[amp]othertext
//       will produce 'text&othertext'
export const resolveentities = (subs) => {
  console.log('.', subs)
  let prevtext = []
  const nsubs = []
  for (const sub of subs) {
    if (typeof sub === 'string') {
      prevtext.push(sub)
    }
    else {
      const {tag, subs} = sub
      if (tag === "'&") {
        prevtext.push(trytostr(subs))
      }
      else {
        if (prevtext.length > 0) {
          nsubs.push(prevtext.join(''))
          prevtext = []
        }
        nsubs.push({tag, subs: resolveentities(subs)})
      }
    }
  }
  if (prevtext.length > 0) nsubs.push(prevtext.join(''))
  return nsubs
}
