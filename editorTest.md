<div id="jevkoEditor"></div>
<div id="jsonEditor"></div>

<script src="editor.bundle.js"></script>
<script>
  const jevkoEditor = editorBundle.makeJevkoEditor()
  const jsonEditor = editorBundle.makeJsonEditor()
  // setTimeout(() => {
  //   document.body.append(document.createTextNode('hm'))
  //   document.body.append(document.createTextNode(jevkoEditor.state.doc.sliceString(0)))
  // }, 3000)
</script>