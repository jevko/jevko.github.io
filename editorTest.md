<style>
  #jevkoEditor, #jsonEditor {
    width: 50%;
    margin: auto;
  }
  #jsonEditor::before {
    content: 'JSON';
  }
  #jevkoEditor::before {
    content: 'Jevko';
  }
</style>

<div id="jevkoEditor"></div>
<div id="jsonEditor"></div>
<button id="click">convert</button>

<script src="editor.bundle.js"></script>
<script type="module" src="editorTest.js"></script>