
I want to write a reusable markdown editor libary in javascript that support live editing.

When the user typed a markdown syntax the editor component renders it immediately in HTML using the appropriate html tags.

Support all ususal markdown syntax (also syntax that is widely used but missing in the original makrdown spec). Beside markdown links also support rendering of normal hyperlinks.

For text formatting and code blocks syntax like headers keep the markdown syntax signs visible for edit. When the user changes the syntax, remove or change the rendering.

For links, images, blockquo, tables, horizontal rule: These elements don't show the markdown syntax but are replaced by the markdown syntax for edit when the user clicks in it. Use left click for all but links. For links edit can be activated with right click.

List editing: Make tab and shift tab usable to indent or unindent list items.

We also support displaying yml front matter with different background color and a monospace font.

Apply a class "milkup" to each rendered tag that can be used to modify the style with a user defined stylesheet.

Make it look good on all devices.

Also make an index.php that includes the editor and loads a demo markdown file. Keep the code as simple as possible (short and easy to read). As specified in the global rules we use a file ajax.php that forwards ajax calls to ajax/my_ajax_handler.php. Please avoid using the __DIR__ magic constant. Because of ajax.php we don't need this. Indent all codes with 2 spaces and put the { on the next line.
