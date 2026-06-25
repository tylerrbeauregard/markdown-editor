# Simple Markdown Editor

View the [demo](https://tylerrbeauregard.github.io/markdown-editor/).

This is a simple client-side markdown editor/viewer. 

External Libraries used:
- The editor uses [Ace Editor](https://ace.c9.io/).
- The markdown parser is mainly [Marked](https://marked.js.org/) with some added features.
- Uses [LaTeX.css](https://latex.vercel.app/) for styling of the output.
- Code blocks with syntax highlighting (rendered in [Prism JS](https://prismjs.com/))
- [KaTeX](https://katex.org/) for Math rendering.

It supports most standard markdown, and some extended features:
 - Math (via LaTeX input)
   - Accepts inline (`$x$` or `\(x\)`) and display style (`$$x$$` or `\[x\]`)
   - Also has the benefit of allowing custom commands and shortcuts
 - Can use LaTeX style quotes `\`\`` and `''` for “ and ”
 - Code blocks with language-specific syntax highlighting.
 - Highlighting using `==highlighted thing==` or `==[color]highlighted thing==`

Some icons come from [Iconoir](https://github.com/iconoir-icons/iconoir/blob/main/README.md) (MIT License).

Note that the parser does not sanitize HTML (so you can use raw HTML for more technical typesetting),
including some of the custom classes from [LaTeX.css](https://latex.vercel.app/), for example:
- `<div class="theorem">` for a LaTeX-like Theorem environment
- Other relevant classes include `author`, `abstract`, `proof`, `definition`, and `lemma`.

The webpage uses LocalStorage to store editor contents between visits (but everyithing is still client side).

Features that may be added at some point (or not!):
 - Check-lists
 - Footnotes
 - Synchronized scrolling
 - Interface customization and font control

Lower priority potential features for the future (but which do not exist now):
 - Updated Ace modes that support LaTeX in Markdown (and just a better LaTeX mode)
 - Maybe some way of adding graphs and figures (besides as images)
 - A graphical equation editor
