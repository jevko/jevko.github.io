import {jevkoFromString} from './jevkoFromStringFenced.js'

const tarea = document.createElement('textarea')
const resultdiv = document.createElement('div')

tarea.onchange(() => {
  try {
    resultdiv.textContent = doctest(jevkoFromString(tarea.value))
  } catch (e) {

  }
})

const {body} = document
body.onload = () => {
  tarea.value = doctesttxt

  body.append(tarea)
  body.append(resultdiv)
}

const doctest = (parsed) => {
  let ret = ''

  for (const {prefix, jevko} of parsed.subjevkos) {
    ret += prefix

    const ss = jevko.subjevkos

    {
      const {prefix, jevko} = ss[0]
      ret += `\n.. ${prefix.replace(/\s/g, '')}:: `
      ret += jevko.suffix
    }

    for (const {prefix, jevko: j} of ss.slice(1, -1)) {
      ret += `\n   :${prefix.replace(/\s/g, '')}: `
      ret += j.suffix
    }

    {
      const {prefix, jevko} = ss.at(-1)
      assert(prefix.trim() === '')
      ret += '\n' + normalizeindent(jevko.suffix, 3)
    }
  }
  ret += parsed.suffix

  return ret
}


const normalizeindent = (str, desired = 3) => {
  const lines = str.split('\n')
  const indents = []
  let lowest = Infinity
  for (const line of lines) {
    let current = 0
    for (let i = 0; i < line.length; ++i) {
      const c = line[i]
      if (c === ' ') {
        current += 1
      } else break
    }
    if (current < lowest) lowest = current
    indents.push(current)
  }

  const ret = []
  let i = 0
  for (const line of lines) {
    const indent = indents[i]
    const lose = (indent - lowest) - desired
    if (lose > 0) {
      ret.push(line.slice(lose))
    } else {
      const ind = Array.from({length: -lose}).join(' ')
      ret.push(ind + line)
    }
    i += 1
  }
  return ret.join('\n')
}

const doctesttxt = `
yada yada

[
  test setup [*]
  skip if [pd is None]
  [\`'
    data = pd.Series([42])
  '\`]
]

yada yada

[
  doc test []
  skip if [pd is None]
  py version [> 3.10]
  [\`'
    >>> data.iloc[0]
    42
  '\`]
]

yada yada

[
  test code []
  skip if [pd is None]
  [\`'
    print(data.iloc[-1])
  '\`]
]

yada yada

[
  test output []
  skip if [pd is None]
  hide []
  options [-ELLIPSIS, +NORMALIZE_WHITESPACE]
  [\`'
    42
  '\`]
]

yada yada
`