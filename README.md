# Simple Markdown Editor

View the [demo](https://tylerrbeauregard.github.io/markdown-editor/).

This is a simple client-side markdown editor/viewer. The editor uses [Ace Editor](https://ace.c9.io/).
The markdown parser is mostly custom (although uses many suggestions from various forum sites)
and uses mainly regex replaces.

It supports most standard markdown, and some extended features:
 - Math (using [KaTeX](https://katex.org/))
   - Accepts inline (`$x$` or `\(x\)`) and display style (`$$x$$` or `\[x\]`)
   - Also has the benefit of allowing custom commands and shortcuts
 - Code blocks with syntax highlighting (rendered in Ace Editor - read only mode)
 - Numbered lists in any order
 - Highlighting using `==highlighted thing==` or `==[color]highlighted thing==`

There is also some custom syntax added:
 - Use `--[color]example text--` for colored text
 - Type `\qed` (outside of math mode) for a right-aligned QED symbol.

Some icons come from [Iconoir](https://github.com/iconoir-icons/iconoir/blob/main/README.md) (MIT License).

There are quite a few bugs in the regex that will need fixed. Also note that the parser does
not sanitize HTML (so you can use raw HTML for more technical typesetting).

The webpage uses LocalStorage to store editor contents between visits (but everyithing is still client side).

Features that may be added at some point (or not!):
 - Better regex
 - Check-lists
 - Footnotes
 - Image naming
 - Synchronized scrolling
 - Interface customization and font control

Lower priority potential features for the future (but which do not exist now):
 - Updated Ace modes that support LaTeX in Markdown (and just a better LaTeX mode)
 - Maybe some way of adding graphs and figures (besides as images)
 - A graphical equation editor
