---
title: Jevko
---

<h1>minimal syntax</h1>

<div style="font-family: monospace; text-align: center;">
[[#data]](#data-interchange)
[[#config]](#configuration)
[[#markup]](#text-markup)
<br/>
[[#more]](#more)
<br/>
[[#pronunciation]](#etymology-and-pronunciation)
[[#license]](#license)
</div>

**Jevko** is a minimal general-purpose syntax that is uniquely suited to seamless manual reading and editing by humans.

It can serve as a portable machine-readable intermediate representation for all kinds of structured information. Because of its simplicity, it maps easily to any existing syntax.

It can also be used as a basic building block for simple and portable formats, languages, and notations in a variety of domains, such as data interchange, configuration, or text markup.

Below are a few examples of Jevko formats in different domains, as compared to known formats.

<a name="data"></a>

## Data interchange^[The data interchange examples shown here are based on an [example piece of JSON from Wikipedia](https://en.wikipedia.org/wiki/JSON#Syntax).]

<style>
  .comparison > div {
    overflow-x: auto;
  }
  div.sourceCode {
    margin: 0;
  }
  /* h1 {
    text-align: center;
  } */
  .jevko .dt, .key .matter {
    text-decoration: dotted underline #888 0.25px;
  }
  .comparison h1 {
    font-size: 2rem;
    font-family: monospace;
  }
</style>

## Configuration^[The configuration examples shown here are based on an [example piece of INI from Wikipedia](https://en.m.wikipedia.org/wiki/INI_file#Example).]

<style>
  .jevko .bracket-0 {
    color: #ffd704;
  }
  .jevko .bracket-1 {
    color: #da70d6;
  }
  .jevko .bracket-2 {
    color: #189dff;
  }
</style>

<div class="comparison black-bg"><div ><h1 >TOML</h1><div class="sourceCode" id="cb1"><pre
class="sourceCode toml"><code class="sourceCode toml"><span id="cb1-1"><a href="#cb1-1" aria-hidden="true" tabindex="-1"></a></span><span id="cb1-2"><a href="#cb1-2" aria-hidden="true" tabindex="-1"></a><span class="co"># last modified 1 April 2001 by John Doe</span></span>
<span id="cb1-3"><a href="#cb1-3" aria-hidden="true" tabindex="-1"></a><span class="kw">[</span><span class="dt">owner</span><span class="kw">]</span></span>
<span id="cb1-4"><a href="#cb1-4" aria-hidden="true" tabindex="-1"></a><span class="dt">name</span> <span class="op">=</span> <span class="st">&quot;John Doe&quot;</span></span>
<span id="cb1-5"><a href="#cb1-5" aria-hidden="true" tabindex="-1"></a><span class="dt">organization</span> <span class="op">=</span> <span class="st">&quot;Acme Widgets Inc.&quot;</span></span>
<span id="cb1-6"><a href="#cb1-6" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb1-7"><a href="#cb1-7" aria-hidden="true" tabindex="-1"></a><span class="kw">[</span><span class="dt">database</span><span class="kw">]</span></span>
<span id="cb1-8"><a href="#cb1-8" aria-hidden="true" tabindex="-1"></a><span class="co"># use IP if name resolution is not working</span></span>
<span id="cb1-9"><a href="#cb1-9" aria-hidden="true" tabindex="-1"></a><span class="dt">server</span> <span class="op">=</span> <span class="st">&quot;192.0.2.62&quot;</span></span>
<span id="cb1-10"><a href="#cb1-10" aria-hidden="true" tabindex="-1"></a><span class="dt">port</span> <span class="op">=</span> <span class="dv">143</span></span>
<span id="cb1-11"><a href="#cb1-11" aria-hidden="true" tabindex="-1"></a><span class="dt">file</span> <span class="op">=</span> <span class="st">&quot;payroll.dat&quot;</span></span>
<span id="cb1-12"><a href="#cb1-12" aria-hidden="true" tabindex="-1"></a><span class="dt">&quot;select columns&quot;</span> <span class="op">=</span> <span class="op">[</span></span>
<span id="cb1-13"><a href="#cb1-13" aria-hidden="true" tabindex="-1"></a>  <span class="st">&quot;name&quot;</span><span class="op">,</span> </span>
<span id="cb1-14"><a href="#cb1-14" aria-hidden="true" tabindex="-1"></a>  <span class="st">&quot;address&quot;</span><span class="op">,</span> </span>
<span id="cb1-15"><a href="#cb1-15" aria-hidden="true" tabindex="-1"></a>  <span class="st">&quot;phone number&quot;</span></span>
<span id="cb1-16"><a href="#cb1-16" aria-hidden="true" tabindex="-1"></a><span class="op">]</span></span></code></pre></div>
</div><div ><h1 >YAML</h1><div class="sourceCode" id="cb1"><pre
class="sourceCode yaml"><code class="sourceCode yaml"><span id="cb1-1"><a href="#cb1-1" aria-hidden="true" tabindex="-1"></a></span><span id="cb1-2"><a href="#cb1-2" aria-hidden="true" tabindex="-1"></a><span class="co"># last modified 1 April 2001 by John Doe</span></span>
<span id="cb1-3"><a href="#cb1-3" aria-hidden="true" tabindex="-1"></a><span class="fu">owner</span><span class="kw">:</span></span>
<span id="cb1-4"><a href="#cb1-4" aria-hidden="true" tabindex="-1"></a><span class="at">  </span><span class="fu">name</span><span class="kw">:</span><span class="at"> John Doe</span></span>
<span id="cb1-5"><a href="#cb1-5" aria-hidden="true" tabindex="-1"></a><span class="at">  </span><span class="fu">organization</span><span class="kw">:</span><span class="at"> Acme Widgets Inc.</span></span>
<span id="cb1-6"><a href="#cb1-6" aria-hidden="true" tabindex="-1"></a></span>
<span id="cb1-7"><a href="#cb1-7" aria-hidden="true" tabindex="-1"></a><span class="fu">database</span><span class="kw">:</span></span>
<span id="cb1-8"><a href="#cb1-8" aria-hidden="true" tabindex="-1"></a><span class="co">  # use IP if name resolution is not working</span></span>
<span id="cb1-9"><a href="#cb1-9" aria-hidden="true" tabindex="-1"></a><span class="at">  </span><span class="fu">server</span><span class="kw">:</span><span class="at"> </span><span class="fl">192.0.2.62</span></span>
<span id="cb1-10"><a href="#cb1-10" aria-hidden="true" tabindex="-1"></a><span class="at">  </span><span class="fu">port</span><span class="kw">:</span><span class="at"> </span><span class="dv">143</span></span>
<span id="cb1-11"><a href="#cb1-11" aria-hidden="true" tabindex="-1"></a><span class="at">  </span><span class="fu">file</span><span class="kw">:</span><span class="at"> </span><span class="st">&quot;payroll.dat&quot;</span></span>
<span id="cb1-12"><a href="#cb1-12" aria-hidden="true" tabindex="-1"></a><span class="at">  </span><span class="fu">select columns</span><span class="kw">:</span></span>
<span id="cb1-13"><a href="#cb1-13" aria-hidden="true" tabindex="-1"></a><span class="at">    </span><span class="kw">-</span><span class="at"> name</span></span>
<span id="cb1-14"><a href="#cb1-14" aria-hidden="true" tabindex="-1"></a><span class="at">    </span><span class="kw">-</span><span class="at"> address</span></span>
<span id="cb1-15"><a href="#cb1-15" aria-hidden="true" tabindex="-1"></a><span class="at">    </span><span class="kw">-</span><span class="at"> phone number</span></span></code></pre></div>
</div><div ><h1 >Jevko</h1><div class="sourceCode"><pre class="jevko sourceCode"><code class="sourceCode"><span class="co">last modified 1 April 2001 by John Doe</span>
<span class="dt">owner</span> <span class="bracket-0">[</span>
  <span class="dt">name</span> <span class="bracket-1">[</span><span class="st">John Doe</span><span class="bracket-1">]</span>
  <span class="dt">organization</span> <span class="bracket-1">[</span><span class="st">Acme Widgets Inc.</span><span class="bracket-1">]</span>
<span class="bracket-0">]</span>
<span class="dt">database</span> <span class="bracket-0">[</span>
  <span class="co">use IP if name resolution is not working</span>
  <span class="dt">server</span> <span class="bracket-1">[</span><span class="st">192.0.2.62</span><span class="bracket-1">]</span>
  <span class="dt">port</span> <span class="bracket-1">[</span><span class="dv">143</span><span class="bracket-1">]</span>
  <span class="dt">file</span> <span class="bracket-1">[</span><span class="st">&#39;payroll.dat&#39;</span><span class="bracket-1">]</span>
  <span class="dt">select columns</span> <span class="bracket-1">[</span>
    <span class="bracket-2">[</span><span class="st">name</span><span class="bracket-2">]</span>
    <span class="bracket-2">[</span><span class="st">address</span><span class="bracket-2">]</span>
    <span class="bracket-2">[</span><span class="st">phone number</span><span class="bracket-2">]</span>
  <span class="bracket-1">]</span>
<span class="bracket-0">]</span>
</code></pre></div>
</div></div>

## Text markup^[The text markup examples shown here are based on an [example pieces of HTML from Wikipedia](https://en.wikipedia.org/wiki/HTML#Attributes).]

<div class="comparison black-bg">
  
<div>
<h1>HTML</h1><div class="sourceCode" id="cb1"><pre
class="sourceCode html"><code class="sourceCode html"><span id="cb1-1"><a href="#cb1-1" aria-hidden="true" tabindex="-1"></a><span class="kw">&lt;html&gt;</span></span>
<span id="cb1-2"><a href="#cb1-2" aria-hidden="true" tabindex="-1"></a>  <span class="kw">&lt;head&gt;</span></span>
<span id="cb1-3"><a href="#cb1-3" aria-hidden="true" tabindex="-1"></a>    <span class="kw">&lt;title&gt;</span>This is a title<span class="kw">&lt;/title&gt;</span></span>
<span id="cb1-4"><a href="#cb1-4" aria-hidden="true" tabindex="-1"></a>  <span class="kw">&lt;/head&gt;</span></span>
<span id="cb1-5"><a href="#cb1-5" aria-hidden="true" tabindex="-1"></a>  <span class="kw">&lt;body&gt;</span></span>
<span id="cb1-6"><a href="#cb1-6" aria-hidden="true" tabindex="-1"></a>    <span class="kw">&lt;div&gt;</span></span>
<span id="cb1-7"><a href="#cb1-7" aria-hidden="true" tabindex="-1"></a>      <span class="kw">&lt;p&gt;</span>Hello world!<span class="kw">&lt;/p&gt;</span></span>
<span id="cb1-8"><a href="#cb1-8" aria-hidden="true" tabindex="-1"></a>      <span class="kw">&lt;abbr</span></span>
<span id="cb1-9"><a href="#cb1-9" aria-hidden="true" tabindex="-1"></a><span class="ot">        id=</span><span class="st">&quot;anId&quot;</span></span>
<span id="cb1-10"><a href="#cb1-10" aria-hidden="true" tabindex="-1"></a><span class="ot">        class=</span><span class="st">&quot;jargon&quot;</span></span>
<span id="cb1-11"><a href="#cb1-11" aria-hidden="true" tabindex="-1"></a><span class="ot">        style=</span><span class="st">&quot;color: purple;&quot;</span></span>
<span id="cb1-12"><a href="#cb1-12" aria-hidden="true" tabindex="-1"></a><span class="ot">        title=</span><span class="st">&quot;Hypertext Markup Language&quot;</span><span class="kw">&gt;</span></span>
<span id="cb1-13"><a href="#cb1-13" aria-hidden="true" tabindex="-1"></a>      HTML<span class="kw">&lt;/abbr&gt;</span></span>
<span id="cb1-14"><a href="#cb1-14" aria-hidden="true" tabindex="-1"></a>      <span class="kw">&lt;a</span> <span class="ot">href</span><span class="ot">=</span><span class="st">&quot;https://www.wikipedia.org/&quot;</span><span class="kw">&gt;</span></span>
<span id="cb1-15"><a href="#cb1-15" aria-hidden="true" tabindex="-1"></a>        A link to Wikipedia!</span>
<span id="cb1-16"><a href="#cb1-16" aria-hidden="true" tabindex="-1"></a>      <span class="kw">&lt;/a&gt;</span></span>
<span id="cb1-17"><a href="#cb1-17" aria-hidden="true" tabindex="-1"></a>      <span class="kw">&lt;p&gt;</span></span>
<span id="cb1-18"><a href="#cb1-18" aria-hidden="true" tabindex="-1"></a>        Oh well, </span>
<span id="cb1-19"><a href="#cb1-19" aria-hidden="true" tabindex="-1"></a>        <span class="kw">&lt;span</span> <span class="ot">lang</span><span class="ot">=</span><span class="st">&quot;fr&quot;</span><span class="kw">&gt;</span>c&#39;est la vie<span class="kw">&lt;/span&gt;</span>, </span>
<span id="cb1-20"><a href="#cb1-20" aria-hidden="true" tabindex="-1"></a>        as they say in France.</span>
<span id="cb1-21"><a href="#cb1-21" aria-hidden="true" tabindex="-1"></a>      <span class="kw">&lt;/p&gt;</span></span>
<span id="cb1-22"><a href="#cb1-22" aria-hidden="true" tabindex="-1"></a>    <span class="kw">&lt;/div&gt;</span></span>
<span id="cb1-23"><a href="#cb1-23" aria-hidden="true" tabindex="-1"></a>  <span class="kw">&lt;/body&gt;</span></span>
<span id="cb1-24"><a href="#cb1-24" aria-hidden="true" tabindex="-1"></a><span class="kw">&lt;/html&gt;</span></span></code></pre></div>
</div>

<div>
<h1>Jevko</h1><div class="sourceCode"><pre class="jevko sourceCode"><code class="sourceCode"><span class="kw">html</span> <span class="kw">[</span>
  <span class="kw">head</span> <span class="kw">[</span>
    <span class="kw">title</span> <span class="kw">[</span>This is a title<span class="kw">]</span>
  <span class="kw">]</span>
  <span class="kw">body</span> <span class="kw">[</span>
    <span class="kw">div</span> <span class="kw">[</span>
      <span class="kw">p</span> <span class="kw">[</span>Hello world!<span class="kw">]</span>
      <span class="kw">abbr</span> <span class="kw">[</span>
        <span class="ot">id=</span><span class="kw">[</span><span class="st">anId</span><span class="kw">]</span>
        <span class="ot">class=</span><span class="kw">[</span><span class="st">jargon</span><span class="kw">]</span>
        <span class="ot">style=</span><span class="kw">[</span><span class="st">color: purple;</span><span class="kw">]</span>
        <span class="ot">title=</span><span class="kw">[</span><span class="st">Hypertext Markup Language</span><span class="kw">]</span>
      HTML<span class="kw">]</span>
      <span class="kw">a</span> <span class="kw">[</span><span class="ot">href=</span><span class="kw">[</span><span class="st">https://www.wikipedia.org/</span><span class="kw">]</span>
        A link to Wikipedia!
      <span class="kw">]</span>
      <span class="kw">p</span> <span class="kw">[</span>
        Oh well, 
        <span class="kw">span</span> <span class="kw">[</span><span class="ot">lang=</span><span class="kw">[</span><span class="st">fr</span><span class="kw">]</span>c&#39;est la vie<span class="kw">]</span>,
        as they say in France.
      <span class="kw">]</span>
    <span class="kw">]</span>
  <span class="kw">]</span>
<span class="kw">]</span>
</code></pre></div>
</div>
</div>

## More

### Formal specification

<!-- ✓  -->
[The Jevko Syntax: Standard Grammar Specification](spec.html) is a complete, stable formal specification of the basic syntax.

### Interactive railroad diagrams

The [Jevko interactive railroad diagrams](diagram.xhtml) complement the specification, together providing a convenient reference for implementing parsers and other Jevko processors.

### Jevko GitHub organization

The [Jevko GitHub organization](https://github.com/jevko) is the official Jevko development zone. There are open-source implementations of various Jevko-related software.

### Jevko for hackers

For do-it-yourself-oriented tinkerers, hackers, or minimalists plain Jevko is ready to be used to define custom formats for all kinds of applications that deal with tree-structured information.

### Syntax highlighting

Experimental Jevko syntax highlighting extensions for Visual Studio Code are available for the following formats/file types:

* Data interchange: [.jevkodata](https://github.com/jevko/jevkodata-basic-highlighting-vscode)
* Configuration: [.jevkocfg](https://github.com/jevko/jevkodata-basic-highlighting-vscode) (same extension as .jevkodata for now)
* Markup: [.jevkoml](https://github.com/jevko/jevkoml-basic-highlighting-vscode)
* Generic: [.jevko](https://github.com/jevko/jevko-basic-highlighting-vscode)

There are also experimental Jevko syntax highlighting definitions for other environments:

* Generic: [.jevko](https://github.com/jevko/jevko-basic-highlighting) -- KDE KatePart Syntax Highlight System, CodeMirror6

## News, social media, other resources

Jevko has an official [RSS channel](/feed.rss) that you can subscribe to for latest news.

Alternatively, you can follow Jevko on [Mastodon](https://layer8.space/@jevko) or [Twitter](https://twitter.com/Jevko1).

You can also follow the official [Jevko GitHub organization](https://github.com/jevko) to track the latest developments.

There is also an official [Jevko organization on Codeberg](https://codeberg.org/jevko-org) and an official [/r/jevko subreddit](https://www.reddit.com/r/jevko/).

Jevko-related resources can also be found at the official [Jevko profile on archive.org](https://archive.org/details/@jevko) and the official [Jevko YouTube channel](https://www.youtube.com/@jevko-org).

## Etymology and pronunciation

The name [*Jevko* /ˈd͡ʒef.kəʊ/](http://ipa-reader.xyz/?text=%CB%88d%CD%A1%CA%92ef.k%C9%99%CA%8A&voice=Joey) is derived from Polish [*drzewko* /ˈdʐɛf.kɔ/](https://en.wiktionary.org/wiki/drzewko), meaning small tree.

## License

Jevko is intended as a universal syntax, to be used without restriction in any software, for any purpose. It is open and free, along with any syntaxes, formats, and standards based upon it.

For legal purposes, if not specified otherwise, Jevko and related projects are under the [MIT License](https://choosealicense.com/licenses/mit/).

<div style="font-size: 10pt">

```
Copyright (c) 2021-2023 Jevko.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

</div>

Thank you for visiting.

***

Jevko is a part of [<img style="width:2rem;position: relative;top: 0.5rem;" src="/tao-logo.svg" /> **TAO**](https://xtao.org), a project to cultivate simplicity in software.

***

<div style="font-size: 30pt; text-align: center;" title="Click here to Google Translate jevko.org. The default target language is Chinese. You can change it in the menu that will appear at the top.">
[Google Translate jevko.org](https://jevko-org.translate.goog/?_x_tr_sl=en&_x_tr_tl=zh-TW&_x_tr_hl=en)
</div>