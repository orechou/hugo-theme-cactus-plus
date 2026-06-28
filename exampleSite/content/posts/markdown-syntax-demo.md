---
title: "Markdown Syntax Demo"
date: 2026-01-25T14:00:00+08:00
draft: false
tags:
  - test
  - markdown
categories:
  - testing
---

This post demonstrates various Markdown syntax supported by the Bat theme.

## Text Formatting

**Bold text**, *italic text*, ***bold italic***

~~Strikethrough~~

`Inline code`

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines,
> and can be nested.

## Lists

### Unordered List

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

### Ordered List

1. First step
2. Second step
3. Third step

## Code Blocks

### Inline Code

Use the `print()` function to output text.

### Code Block (with syntax highlighting)

```python
def greet(name):
    return f"Hello, {name}!"

print(greet("World"))
```

## Links

[Internal link](/posts/welcome-to-bat-theme)

[External link](https://gohugo.io)

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Theme toggle | ✅ Done | High |
| Responsive | ✅ Done | High |
| Comments | 🚧 In progress | Medium |

## Horizontal Rule

---

## Images

![Image description](/images/logo.png "The bundled theme logo — click any inline image to zoom.")

## Task List

- [x] Complete theme toggle
- [x] Implement responsive design
- [ ] Add more color schemes
- [ ] Optimize mobile experience

## Footnotes

This is a footnote text.[^1]

[^1]: Footnote content, click to jump.

## Math Formulas (requires MathJax configuration)

Inline formula: $E = mc^2$

Block formula:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Conclusion

Bat theme perfectly supports all the Markdown syntax above!
