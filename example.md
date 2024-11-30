# Try my editor out

> This is a simple markdown parser with some added
features specific to my needs. 
Let's see some of the stuff it can do!

As you've already seen, we can do headers and blockquotes.
We can als do **bold** and *italic* text and more. 
We even have some shortcuts:
- `CTRL` s+ `b`: **Bold**
- `CTRL` + `i`: *Italics*
- `CTRL` + `u`: __Underline__
- `CTRL` + `4` (can think of `CTRL` + `$`): $\LaTeX$

That's right, I forgot to say, we can do $\LaTeX$ code!
Here's a table that explains that
(oh yeah, we have tables!)

|Markdown types    | Renders as | Example |
|------------------|------------|---------|
|`$x$` or `\(x\)`  | Inline math| $x$     |
|`$$x$$` or `\[x\]`|Display math|$$x$$    |


Cool huh? Here's a bit more impressive display of math:
\[
    \left\langle
\begin{matrix}
1 & 2 & 3\\
a & b & c
\end{matrix}
\right\rvert
=
\int_3^7 \lim_{n\to\infty} \frac{1}{x^n}\,dx \in \R.
\]
and we can do align environments 
(all thanks to [$\KaTeX$](https://katex.org/)).
Oh shit! Was that a link? With math in it? (yup 😏)
\[
\begin{align*}
    x &= 1 \\
    2x &= 2.
\end{align*}
\]
You can also use special shortcut commands 
like `\R` for $\R$. Feel free to add/edit them
using the "Custom Command" button. Here's
a line:

---

We can also do code blocks with syntax highlighting:
```python
for i in range(1000):
    print("This is pretty nice!")
```

Wow, I bet you're thinking, this is pretty nice. Well,
there's more:
1. Highlighting: ==Like this==. And there are special options:
    - `==[navy]stuff==` gives ==[navy]stuff==

2. Changing text color:
    - `--[red]🚨red alert🚨--` gives --[red]🚨red alert🚨--

3. A special command for when you finish a proof.
    - Type `\qed` (without dolar signs) to end a proof.
\qed
## Images
Images in markdown work like this:
```markdown
![alternative-text](imageurl)
```
For example typing
```markdown
![husky](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/DOG-HUSKY_23JUL00.jpg/220px-DOG-HUSKY_23JUL00.jpg)
```
will give the following:  
![husky](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/DOG-HUSKY_23JUL00.jpg/220px-DOG-HUSKY_23JUL00.jpg)  
What a good boy! I added some options that can help with 
image placement if needed
```markdown
![alternative-text]{option}(link)
```
Where the options are as follows:
* **right, center, left**
    * aligns your photo. With no options, the photo is rendered inline
* **float:left, float:right**
    * aligns your photo, but also wraps text around it.
⚠️--[orange]Warning: these features are expiramental--⚠️
(Examples at the end)

## Helpful links
I haven't made a guide explaining all of the rules. We
mostly try to use markdown rules. You can see more
info [here](https://www.markdownguide.org/cheat-sheet/).

Here are the image examples:

Lorem ipsum odor amet, consectetuer adipiscing elit.
Accumsan amet himenaeos sed suspendisse montes hendrerit.
![test]{float:right}(https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/14_year_old_Corgi.jpg/170px-14_year_old_Corgi.jpg)
volutpat venenatis iaculis morbi sem per condimentum.
Sem class auctor porttitor auctor penatibus integer maximus.
Auctor proin nostra proin aenean fames vel.
Auctor feugiat tortor pellentesque; magna integer et quam.
Diam pretium porttitor nostra suscipit massa erat.

Congue dolor dignissim tempus mi urna placerat quisque blandit.
![bulldog]{float:left}(https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Clyde_The_Bulldog.jpg/220px-Clyde_The_Bulldog.jpg)
Eget semper bibendum fringilla dictum feugiat phasellus enim.
Lacus ex metus at vitae nibh.
Vehicula lobortis lacinia vel posuere ullamcorper amet.
Rhoncus imperdiet massa maecenas magnis efficitur euismod erat laoreet.
Eros ante lacus sit urna pulvinar facilisis.
Facilisi metus pulvinar facilisi augue interdum mauris suspendisse lobortis.
Velit nullam torquent cursus; etiam vestibulum vitae.
Finibus efficitur class semper justo nibh ridiculus nisl?

Aliquam elit rutrum vestibulum dictum commodo nostra per.
Ligula augue iaculis natoque, est aenean rutrum inceptos.
Cursus habitant fermentum etiam leo vehicula, mus molestie primis vitae.
Integer sollicitudin nascetur; nunc maecenas tempus donec at.
Elementum ante imperdiet cursus scelerisque fusce.
Condimentum a adipiscing class porta leo potenti ridiculus dapibus.
Montes dapibus fames donec montes gravida vitae viverra pharetra.
Nibh curae ridiculus suscipit litora facilisis mus.

![center-dog]{center}(https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/640px-Huskiesatrest.jpg)

Dui vehicula rhoncus placerat consectetur varius.
Quisque vulputate at enim turpis aliquam hendrerit curabitur.
Id habitasse fusce mattis sem lobortis, montes mattis pellentesque.
Class semper mi elementum nibh himenaeos purus sollicitudin.
Venenatis sagittis dapibus habitasse etiam congue at.
