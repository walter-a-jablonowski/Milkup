
I want to write a reusable markdown editor library in javascript that support live rendering in place while the user is editing.

When the user typed a markdown syntax the editor component renders it immediately in HTML using the appropriate html tags.

### Syntax

Support all usual markdown syntax (also syntax that is widely used but missing in the original markdown spec). Most basic sytanx is at least:

- Headings using #
- Text formatting (bold, italic, bold and italic, strike)
- inline code

Beside markdown links also support rendering of normal hyperlinks.

For basic syntax and code blocks keep the markdown syntax signs visible for edit. When the user changes the syntax, remove or change the rendering.

For links, images, blockquo, tables, horizontal rule: These elements don't show the markdown syntax but are replaced by the markdown syntax for edit when the user clicks in it. Use left click for all but links. For links edit can be activated with right click.

List editing: Make tab and shift tab usable to indent or unindent list items.

We also support displaying yml front matter with different background color and a monospace font.

### UI and style

Apply a class "milkup" to each rendered tag that can be used to modify the style with a user defined stylesheet.

Make it look good on all devices.

### Data loading and persistence

- Loading: the server prints the data in a html tag on page load (ususally using PHP)
- Saving: use ajax and PHP on the server to save the data

### Demo

Also make an index.php that includes the editor and loads a demo markdown file.

### Code rules

- Use no existing libraries, implement from scratch.
- Keep the code as simple as possible (short and easy to read). Make a nice API interface for the library.
- As specified in the global rules we use a file ajax.php that forwards ajax calls to ajax/my_ajax_handler.php. Please avoid using the __DIR__ magic constant. Because of ajax.php we don't need this.
- Indent all codes with 2 spaces and put the { on the next line.
