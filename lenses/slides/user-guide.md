## ?slides

Renders Markdown documents as a slide show using
[Remark.js](https://github.com/gnab/remark/wiki).

This lens also adds interactivity to code blocks in your slides ...

### Snippets in a Slide

If a slide has a code block and other information, the block will be highlight
and study buttons will be added.

### Snippets are a Slide

If the only content in a slide is a code snippet, that snippet will be rendered
as a full-slide study lens exercise.

You can configure which lens(es) are used with an HTML comment before the code
block:

```markdown
<!-- ? lens-name (lense-name (...)) -->
```

### Study Lens Web Component

Slides will also load a `<study-lens>` component you can use to embed code from
relative files in a full-slide exercise. This is helpful for examples/exercises
you want to reuse elsewhere, or things that aren't a single file like worked
examples or separated web pages:

```markdown
...

---

<!-- a slide with a relative file -->

<study-lens src="./fibonacci.js"
lenses="pseudo highlight"></study-lens>

---

<!-- a slide with a worked example -->

<study-lens src="./worked-examples/reverse-user-input"
lenses="stepped"></study-lens>

---

<!-- a slide with an HTML/CSS/Project loaded as a folder -->

<study-lens src="./a-website" lenses="study"></study-lens>

---

...
```
