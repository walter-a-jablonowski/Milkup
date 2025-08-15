# Milkup - Live Markdown Editor Library

## Project Overview

Create a reusable JavaScript markdown editor library that provides live, in-place rendering while users edit. The editor must immediately convert markdown syntax to HTML using appropriate HTML tags as the user types, creating a seamless WYSIWYG-like experience while maintaining markdown source accessibility.

## Core Functionality Requirements

### Live Rendering Engine
- **Immediate Response**: Render markdown to HTML instantly as the user types each character
- **In-Place Rendering**: Transform markdown syntax directly within the editor without switching views
- **Cursor Preservation**: Maintain cursor position and selection during live rendering operations
- **Performance**: Handle documents up to 10,000 lines without noticeable lag
- **Undo/Redo Support**: Preserve browser's native undo/redo functionality during live rendering

### Error Handling
- **Malformed Syntax**: Gracefully handle incomplete or invalid markdown syntax without breaking the editor
- **Nested Syntax**: Properly resolve conflicts when markdown syntax elements are nested (e.g., bold within code blocks)
- **Partial Typing**: Handle intermediate states while users are typing multi-character syntax (e.g., typing `**` for bold)

## Markdown Syntax Support

### Required Basic Syntax
Support all CommonMark specification elements plus widely-adopted extensions:

**Text Formatting:**
- Headings: `#` through `######` → `<h1>` through `<h6>`
- Bold: `**text**` or `__text__` → `<strong>text</strong>`
- Italic: `*text*` or `_text_` → `<em>text</em>`
- Bold+Italic: `***text***` → `<strong><em>text</em></strong>`
- Strikethrough: `~~text~~` → `<del>text</del>`
- Inline code: `` `code` `` → `<code>code</code>`

**Links and Media:**
- Markdown links: `[text](url)` → `<a href="url">text</a>`
- Auto-links: Detect and render plain URLs (http/https) as clickable links
- Images: `![alt](src)` → `<img alt="alt" src="src">`

**Block Elements:**
- Code blocks: ``` or ~~~ with optional language → `<pre><code class="language-x">content</code></pre>`
- Blockquotes: `> text` → `<blockquote>text</blockquote>`
- Horizontal rules: `---`, `***`, or `___` → `<hr>`
- Tables: GitHub-flavored markdown table syntax
- Lists: Unordered (`-`, `*`, `+`) and ordered (`1.`, `2.`) with nesting support

**Special Features:**
- YAML front matter: Content between `---` delimiters at document start
- Line breaks: Double space + newline or double newline

### Syntax Visibility Rules

**Always Visible (Editable):**
- Heading markers (`#`, `##`, etc.)
- Text formatting markers (`**`, `*`, `~~`, `` ` ``)
- Code block delimiters (``` or ~~~)
- List markers (`-`, `*`, `1.`, etc.)

**Hidden When Rendered (Contextual Edit):**
- Link syntax `[text](url)` → Show only rendered link, edit via context menu/long press
- Image syntax `![alt](src)` → Show only rendered image, edit via context menu/long press
- Blockquote markers `>` → Hide markers, show styled blockquote
- Table syntax → Show rendered table, edit via context menu/long press
- Horizontal rule syntax → Show rendered HR, edit via context menu/long press

## User Interaction Specifications

### List Management
- **Tab Key**: Increase indentation level of current list item
- **Shift+Tab**: Decrease indentation level of current list item
- **Enter Key**: Create new list item at same indentation level
- **Backspace**: Remove list marker if at beginning of empty list item

### Context Menu System (Desktop)
- **Trigger**: Right-click on rendered elements (links, images, blockquotes, tables, HR)
- **Options**: Edit, Delete, Copy markdown source
- **Edit Mode**: Replace rendered element with editable markdown syntax
- **Save**: Return to rendered state when user clicks outside or presses Enter

### Touch Interface (Mobile/Tablet)
- **Trigger**: Long press (500ms) on rendered elements
- **Behavior**: Same functionality as desktop context menu
- **Visual Feedback**: Highlight element during long press

### YAML Front Matter Display
- **Background Color**: Beige (#F5F5DC)
- **Font**: Monospace font family
- **Borders**: Subtle border to distinguish from main content
- **Editing**: Always show raw YAML syntax, never render as HTML

## UI and Styling Requirements

### CSS Class System
- **Primary Class**: Apply `milkup` class to all rendered HTML elements
- **Specific Classes**: Add semantic classes (e.g., `milkup-heading`, `milkup-code`, `milkup-link`)
- **State Classes**: Add classes for editing states (e.g., `milkup-editing`, `milkup-selected`)

### Responsive Design
- **Mobile (< 768px)**: Single column layout, touch-optimized controls
- **Tablet (768px - 1024px)**: Optimized for touch with larger tap targets
- **Desktop (> 1024px)**: Full feature set with context menus
- **Font Scaling**: Respect user's browser font size preferences
- **Dark Mode**: Support CSS prefers-color-scheme media query

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility for all features
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **High Contrast**: Support for high contrast mode

## Data Management

### Loading Data
- **Method**: Server renders initial markdown content in HTML data attribute
- **Format**: `<div id="editor" data-content="escaped-markdown-content"></div>`
- **Initialization**: Library reads data-content attribute on startup
- **Encoding**: Properly escape HTML entities in data attribute

### Saving Data
- **Trigger**: Auto-save after 2 seconds of inactivity, or manual save via API
- **Method**: AJAX POST to server endpoint
- **Format**: JSON payload: `{"content": "raw-markdown-string", "id": "document-id"}`
- **Error Handling**: Retry failed saves, show user notification for persistent failures
- **Conflict Resolution**: Detect concurrent edits, prompt user for resolution

### AJAX Implementation
- **Endpoint**: Use existing `ajax.php` forwarding system
- **Handler**: Route to `ajax/save_markdown.php`
- **Response Format**: JSON with success/error status and optional message
- **Security**: Include CSRF token validation

## API Design

### Initialization
```javascript
const editor = new Milkup(element, options);
```

### Configuration Options
```javascript
{
  autoSave: true,              // Enable auto-save
  autoSaveDelay: 2000,         // Auto-save delay in milliseconds
  placeholder: "Start writing...", // Placeholder text
  maxLength: null,             // Maximum character limit
  saveEndpoint: "ajax.php",    // Save endpoint URL
  onSave: function(success) {}, // Save callback
  onError: function(error) {}   // Error callback
}
```

### Public Methods
- `editor.getContent()` - Return raw markdown string
- `editor.setContent(markdown)` - Set editor content
- `editor.save()` - Manually trigger save
- `editor.focus()` - Focus the editor
- `editor.destroy()` - Clean up editor instance

### Events
- `milkup:save` - Fired when content is saved
- `milkup:change` - Fired when content changes
- `milkup:error` - Fired when errors occur

## Demo Implementation

### File Structure
```
index.php           # Main demo page
demo.md            # Sample markdown content
milkup.js          # Main library file
milkup.css         # Default styles
ajax.php           # AJAX request router
ajax/save_markdown.php  # Save handler
```

### Demo Features
- Load sample markdown file (`demo.md`) on page load
- Demonstrate all supported markdown syntax
- Include save functionality with visual feedback
- Responsive design showcase
- Error handling demonstration

## Technical Implementation Requirements

### Code Quality Standards
- **No External Dependencies**: Implement all functionality from scratch using vanilla JavaScript
- **Browser Support**: Modern browsers (ES6+), graceful degradation for older browsers
- **Code Style**: 2-space indentation, opening braces on new lines
- **API Design**: Simple, intuitive interface with clear method names
- **Documentation**: Comprehensive inline comments and JSDoc annotations

### File Organization
- **Single File Library**: All core functionality in `milkup.js`
- **Modular Structure**: Organize code into logical sections/classes within the file
- **CSS Separation**: Keep all styles in separate `milkup.css` file
- **No Magic Constants**: Avoid `__DIR__` and similar, use relative paths

### Performance Considerations
- **Debounced Rendering**: Prevent excessive re-rendering during rapid typing
- **Efficient DOM Updates**: Minimize DOM manipulation, use document fragments
- **Memory Management**: Properly clean up event listeners and references
- **Large Document Handling**: Implement virtual scrolling for very large documents

### Security Requirements
- **XSS Prevention**: Properly sanitize all user input before rendering
- **CSRF Protection**: Include CSRF tokens in AJAX requests
- **Input Validation**: Validate all data on both client and server side
- **Safe HTML Generation**: Use proper DOM methods instead of innerHTML where possible

## Success Criteria

### Functional Requirements
- All specified markdown syntax renders correctly in real-time
- Context menus and touch interactions work as specified
- Data loading and saving functions properly
- Demo page showcases all features effectively

### Performance Requirements
- Typing response time under 50ms for documents up to 1000 lines
- Memory usage remains stable during extended editing sessions
- No visual flickering during live rendering
- Smooth scrolling and interaction on all supported devices

### Quality Requirements
- Code passes JSLint/ESLint with zero warnings
- All features work across specified browser versions
- Responsive design functions properly on all device sizes
- Accessibility requirements are fully met
