import { htmlstrToJdaml, xmlstrToJdaml } from "./xmltojdaml.js"

// note this only works in the browser for now
// e.g. by import {} from './xmltojdaml.test.js'
// todo: make it work with jsdom/abstract dom/parser provider

const xmlstr = `<jdaml first-name="John" last-name="Smith">
<is-alive _isattr="true"><true></true></is-alive>
<age _isattr="true"><u8>27</u8></age>
<address _isattr="true" street-address="21 2nd Street" city="New York" state="NY" postal-code="10021-3100">
</address>
<phone-numbers _isattr="true">
  <_node type="home" number="212 555-1234">
  </_node>
  <_node type="office" number="646 555-4567">
  </_node>
</phone-numbers>
<children _isattr="true"><seq></seq></children>
<spouse _isattr="true"><nil></nil></spouse>
</jdaml>`
const str2 = `<jdaml>



<canvas id="display"></canvas>

<span class="document">
  <span class="flexi">
    <a title="Click here to play the Game of Life" href="https://djedr.github.io/gol.html" class="rightmargin"><img alt="avatar" src="gfx/avatar.png" class="avatar">
    </a>
    
    <a title="Click here to go to the home page" href="https://djedr.github.io/index.html"><h1>Darius J Chuck</h1></a>
  </span>

  <p>    Hello, I'm Darius. Welcome to my website. Here you can 
    learn things relevant for doing business with me, hiring me, 
    or connecting professionally.
  </p>

  <span class="flexi">
    <a href="https://jevko.org/" class="rightmargin"><img alt="jevko logo" src="gfx/jevko.png" class="avatar"></a>
    
    <p>      I created <a href="https://jevko.org/">Jevko</a>, 
      a minimal general-purpose syntax.
    </p>
  </span>

  <span class="flexi">
    <a href="https://xtao.org" class="rightmargin"><img alt="tao logo" src="gfx/tao-logo.png" class="avatar"></a>

    <p>      Jevko is part of <a href="https://xtao.org">TAO</a>, 
      my project to cultivate simplicity in software.
    </p>
  </span>

  <p>    You may be interested in my:
  </p>
  <ul>
    <li><a href="https://djedr.github.io/resume.html">resume   </a></li>
    <li><a href="https://djedr.github.io/projects.html">projects </a></li>
    <li><a href="https://xtao.org/blog.html">writing  </a></li>
  </ul>

  <p>    Or my social media profiles:
  </p>
  <ul>
    
    <li><a href="https://www.linkedin.com/in/dariusz-jędrzejczak-b65134103">LinkedIn    </a></li>
    <li><a href="https://github.com/djedr">GitHub      </a></li>
    <li><a href="https://codeberg.org/djedr">Codeberg    </a></li>
    <li><a href="https://mastodon.social/@djedr" rel="me">Mastodon    </a></li>
    <li><a href="https://news.ycombinator.com/user?id=djedr">Hacker News </a></li>
    <li><a href="https://www.reddit.com/user/djedr/">Reddit      </a></li>
  </ul>

  <p>    Thank you for visiting.
  </p>
</span>

<script src="scripts/gol.js"></script>

<style>
  jdaml {
    background-color: #111;
    color: #eee;
  }
  a {
    text-decoration: none;
    color: yellow;
  }
  .document {
    position: relative;
    display: block;
    max-width: 44em;
    padding: 0 1em;
    margin: auto;
    margin-top: 1em;
    position: relative;
    font-family: "Times New Roman", Times, serif;
    font-size: 17pt;
  }
  .avatar {
    width: 64px;
  }
  .flexi {
    display: flex;
    align-items: center;
    margin-bottom: 1em;
  }
  .rightmargin {
    margin-right: 1em;
  }
  canvas {
    opacity: 0.05;
    /*z-index: -1;*/
    transform-origin: top left;
    transform: scale(8, 8);
    position: fixed;
    top: 0;
    pointer-events: none;
    image-rendering: pixelated;
  }
</style></jdaml>`
const c = xmlstrToJdaml(xmlstr)
console.log(c)


const htmlstr = `<jdaml>

<html>
  <head>
    <title>This is a title</title>
  </head>
  <body>
    <div>
      <p>Hello world!</p>
      <abbr id="anId" class="jargon" style="color: purple;" title="Hypertext Markup Language">
      HTML</abbr>
      <a href="https://www.wikipedia.org/">
        A link to Wikipedia!
      </a>
      <p>
        Oh well, 
        <span lang="fr">c'est la vie</span>,
        as they say in France.
      </p>
    </div>
  </body>
</html>
</jdaml>`

const d = htmlstrToJdaml(htmlstr)
console.log(d)