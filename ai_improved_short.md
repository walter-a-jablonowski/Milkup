I want to write a reusable markdown editor library in javascript that supports live rendering in place while the user is editing.

When the user types markdown syntax, the editor component renders it immediately in HTML using the appropriate html tags.

### Syntax

Support all usual markdown syntax (also syntax that is widely used but missing in the original markdown spec). Most basic syntax is at least:

- Headings using # (h1-h6)
- Text formatting (bold **text**, italic *text*, bold and italic ***text***, strikethrough ~~text~~)
- Inline code `code`
- Code blocks with triple backticks ```
- Unordered lists with - or *
- Ordered lists with numbers
- Blockquotes with >
- Horizontal rules with ---
- Tables with | syntax

Besides markdown links `[text](url)` also support rendering of normal hyperlinks (auto-detect URLs).

**Editing behavior:**

For basic syntax and code blocks: keep the markdown syntax signs visible for editing. When the user changes the syntax, update the rendering accordingly.

For links, images, blockquotes, tables, horizontal rules: These elements don't show the markdown syntax but are replaced by rendered HTML. To edit these elements:

- On desktop: use a custom context menu (right-click)
- On tablet or smartphone: use long press

**List editing:** Make tab and shift+tab usable to indent or unindent list items.

**YAML front matter:** Support displaying YAML front matter (between --- delimiters) with different background color (beige) and monospace font.

### UI and Style

Apply a class "milkup" to each rendered tag that can be used to modify the style with a user-defined stylesheet.

Make it responsive and look good on all devices (desktop, tablet, smartphone).

### Data Loading and Persistence

- **Loading:** The server prints the markdown data in an HTML element on page load (usually using PHP). The editor should initialize from this element's content.
- **Saving:** Use AJAX and PHP on the server to save the data. Implement auto-save functionality that triggers after user stops typing for a configurable delay (default 2 seconds).

### Demo

Create an index.php that includes the editor and loads a demo markdown file (demo.md). The demo should showcase all supported markdown features.

### API Interface

The library should provide a simple API:

```javascript
// Initialize editor
const editor = new MilkupEditor(element, options);

// Options should include:
// - autoSave: boolean (default true)
// - autoSaveDelay: number in ms (default 2000)
// - saveUrl: string (AJAX endpoint for saving)
// - onSave: callback function
// - onError: callback function
```

### Code Rules

- Use no existing libraries, implement from scratch
- Keep the code as simple as possible (short and easy to read)
- Make a clean API interface for the library
- As specified in the global rules, use a file ajax.php that forwards AJAX calls to ajax/save_markdown.php
- Avoid using the __DIR__ magic constant since ajax.php handles routing
- Indent all code with 2 spaces and put the { on the next line
- Use proper error handling for AJAX requests and user feedback

### File Structure

```
/milkup.js          # Main library file
/milkup.css         # Default styles
/index.php          # Demo page
/demo.md            # Demo content
/ajax.php           # AJAX router
/ajax/save_markdown.php  # Save handler
```
