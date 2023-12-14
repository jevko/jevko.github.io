import {jevkoFromString} from './jevkoFromStringFenced.js'
import { makeJevkoEditor } from './editor.bundle.js';

const resultdiv = document.createElement('pre')
const editordiv = document.createElement('div')

const replaceEditorContents = (editor, str)=>{
  editor.dispatch({
      changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: str
      }
  });
};

const {body} = document
body.onload = () => {
  body.style = `display: flex; flex-direction: column; height: 100vh; box-sizing: border-box; margin: 0; padding: 1rem`

  const sidebysidediv = document.createElement('div')
  sidebysidediv.style = `display: flex; flex-direction: row;`

  const editor = makeJevkoEditor(editordiv)
  editordiv.style = 'flex-grow: 1; max-width: 45vw;'

  replaceEditorContents(editor, doctesttxt)

  body.onkeydown = (e) => {
    if (e.ctrlKey) {

      try {
        resultdiv.textContent = doctest(jevkoFromString(editor.state.doc.toString()))
      } catch (e) {
        console.error(e)
      }
    }
  }

  resultdiv.style = `flex-grow: 1; margin: 0 1rem;`

  sidebysidediv.append(editordiv)
  sidebysidediv.append(resultdiv)

  const hints = document.createElement('div')
  hints.textContent = `press Ctrl to process your input`

  body.append(hints)
  body.append(sidebysidediv)
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
      // assert(prefix.trim() === '')
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