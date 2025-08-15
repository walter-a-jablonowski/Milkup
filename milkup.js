class Milkup
{
  constructor( container, options = {} )
  {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = {
      saveUrl: options.saveUrl || 'ajax.php',
      autoSave: options.autoSave || false,
      ...options
    };
    
    this.content = '';
    this.editingElement = null;
    this.contextMenu = null;
    this.pressTimer = null;
    
    this.init();
  }
  
  init()
  {
    this.container.contentEditable = true;
    this.container.className = 'milkup-editor';
    
    // Event listeners
    this.container.addEventListener('input', this.handleInput.bind(this));
    this.container.addEventListener('keydown', this.handleKeydown.bind(this));
    this.container.addEventListener('contextmenu', this.handleContextMenu.bind(this));
    this.container.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.container.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Hide context menu on click outside
    document.addEventListener('click', this.hideContextMenu.bind(this));
  }
  
  handleInput( e )
  {
    // Skip if we're in edit mode
    if( this.editingElement ) return;
    
    this.content = this.container.textContent;
    this.renderWithCursorPreservation();
    
    if( this.options.autoSave )
    {
      this.save();
    }
  }
  
  handleKeydown( e )
  {
    // Tab handling for lists
    if( e.key === 'Tab' )
    {
      e.preventDefault();
      this.handleTabIndent( e.shiftKey );
    }
    
    // Escape to exit edit mode
    if( e.key === 'Escape' )
    {
      this.exitEditMode();
    }
  }
  
  handleContextMenu( e )
  {
    const target = e.target.closest('.milkup-link, .milkup-image, .milkup-blockquo, .milkup-table, .milkup-hr');
    if( target )
    {
      e.preventDefault();
      this.showContextMenu( e.clientX, e.clientY, target );
    }
  }
  
  handleTouchStart( e )
  {
    const target = e.target.closest('.milkup-link, .milkup-image, .milkup-blockquo, .milkup-table, .milkup-hr');
    if( target )
    {
      this.pressTimer = setTimeout(() => {
        this.enterEditMode( target );
      }, 500);
    }
  }
  
  handleTouchEnd( e )
  {
    if( this.pressTimer )
    {
      clearTimeout( this.pressTimer );
      this.pressTimer = null;
    }
  }
  
  showContextMenu( x, y, element )
  {
    this.hideContextMenu();
    
    this.contextMenu = document.createElement('div');
    this.contextMenu.className = 'milkup-context-menu';
    this.contextMenu.innerHTML = '<div class="milkup-menu-item">Edit</div>';
    this.contextMenu.style.position = 'fixed';
    this.contextMenu.style.left = x + 'px';
    this.contextMenu.style.top = y + 'px';
    
    this.contextMenu.querySelector('.milkup-menu-item').addEventListener('click', () => {
      this.enterEditMode( element );
      this.hideContextMenu();
    });
    
    document.body.appendChild( this.contextMenu );
  }
  
  hideContextMenu()
  {
    if( this.contextMenu )
    {
      this.contextMenu.remove();
      this.contextMenu = null;
    }
  }
  
  enterEditMode( element )
  {
    const markdown = this.getMarkdownForElement( element );
    const input = document.createElement('input');
    input.value = markdown;
    input.className = 'milkup-edit-input';
    
    this.editingElement = element;
    
    input.addEventListener('keydown', ( e ) => {
      if( e.key === 'Enter' )
      {
        e.preventDefault();
        this.saveEdit( input, markdown );
      }
      else if( e.key === 'Escape' )
      {
        e.preventDefault();
        this.cancelEdit( input );
      }
    });
    
    element.parentNode.replaceChild( input, element );
    input.focus();
    input.select();
  }
  
  saveEdit( input, originalMarkdown )
  {
    const newMarkdown = input.value;
    
    // Update content by replacing the original markdown
    this.content = this.content.replace( originalMarkdown, newMarkdown );
    
    // Clear edit state and re-render
    this.editingElement = null;
    input.remove();
    this.render();
  }
  
  cancelEdit( input )
  {
    // Restore original element
    input.parentNode.replaceChild( this.editingElement, input );
    this.editingElement = null;
  }
  
  exitEditMode()
  {
    const input = this.container.querySelector('.milkup-edit-input');
    if( input )
    {
      input.blur();
    }
  }
  
  handleTabIndent( isShiftTab )
  {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const listItem = range.startContainer.parentElement.closest('li');
    
    if( listItem )
    {
      const list = listItem.parentElement;
      if( isShiftTab )
      {
        // Unindent
        this.unindentListItem( listItem );
      }
      else
      {
        // Indent
        this.indentListItem( listItem );
      }
    }
  }
  
  indentListItem( listItem )
  {
    const prevItem = listItem.previousElementSibling;
    if( prevItem )
    {
      let subList = prevItem.querySelector('ul, ol');
      if( ! subList )
      {
        subList = document.createElement( listItem.parentElement.tagName.toLowerCase() );
        subList.className = 'milkup-list';
        prevItem.appendChild( subList );
      }
      subList.appendChild( listItem );
    }
  }
  
  unindentListItem( listItem )
  {
    const parentList = listItem.parentElement;
    const grandParentItem = parentList.parentElement.closest('li');
    
    if( grandParentItem )
    {
      const grandParentList = grandParentItem.parentElement;
      grandParentList.insertBefore( listItem, grandParentItem.nextSibling );
    }
  }
  
  
  
  renderWithCursorPreservation()
  {
    // Save cursor position
    const selection = window.getSelection();
    let cursorOffset = 0;
    
    if( selection.rangeCount > 0 )
    {
      const range = selection.getRangeAt(0);
      cursorOffset = this.getCursorOffset( range );
    }
    
    // Render content
    this.render();
    
    // Restore cursor position
    this.setCursorOffset( cursorOffset );
  }
  
  getCursorOffset( range )
  {
    let offset = 0;
    const walker = document.createTreeWalker(
      this.container,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let node;
    while( node = walker.nextNode() )
    {
      if( node === range.startContainer )
      {
        return offset + range.startOffset;
      }
      offset += node.textContent.length;
    }
    
    return offset;
  }
  
  setCursorOffset( offset )
  {
    const walker = document.createTreeWalker(
      this.container,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    let currentOffset = 0;
    let node;
    
    while( node = walker.nextNode() )
    {
      const nodeLength = node.textContent.length;
      
      if( currentOffset + nodeLength >= offset )
      {
        const range = document.createRange();
        const selection = window.getSelection();
        
        range.setStart( node, offset - currentOffset );
        range.collapse( true );
        
        selection.removeAllRanges();
        selection.addRange( range );
        return;
      }
      
      currentOffset += nodeLength;
    }
  }
  
  render()
  {
    const lines = this.content.split('\n');
    let html = '';
    let inYamlFrontMatter = false;
    
    for( let i = 0; i < lines.length; i++ )
    {
      const line = lines[i];
      
      // YAML front matter detection
      if( line.trim() === '---' )
      {
        if( i === 0 )
        {
          // Start of YAML front matter
          inYamlFrontMatter = true;
          html += `<div class="milkup-yaml-line milkup-yaml-delimiter">---</div>`;
        }
        else if( inYamlFrontMatter )
        {
          // End of YAML front matter
          html += `<div class="milkup-yaml-line milkup-yaml-delimiter">---</div>`;
          inYamlFrontMatter = false;
        }
        else
        {
          // Regular horizontal rule
          html += this.renderLine( line );
        }
        continue;
      }
      
      // YAML content lines
      if( inYamlFrontMatter )
      {
        html += `<div class="milkup-yaml-line">${this.escapeHtml(line)}</div>`;
        continue;
      }
      
      html += this.renderLine( line ) + '\n';
    }
    
    this.container.innerHTML = html;
  }
  
  renderLine( line )
  {
    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if( headerMatch )
    {
      const level = headerMatch[1].length;
      const text = this.renderInline( headerMatch[2] );
      return `<h${level} class="milkup-header milkup-h${level}">${headerMatch[1]} ${text}</h${level}>`;
    }
    
    // Horizontal rule
    if( line.match(/^(-{3,}|\*{3,}|_{3,})$/) )
    {
      return '<hr class="milkup-hr">';
    }
    
    // Blockquo
    if( line.startsWith('> ') )
    {
      const text = this.renderInline( line.substring(2) );
      return `<blockquote class="milkup-blockquo">${text}</blockquote>`;
    }
    
    // Lists
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
    if( listMatch )
    {
      const indent = listMatch[1].length;
      const marker = listMatch[2];
      const text = this.renderInline( listMatch[3] );
      const isOrdered = /\d+\./.test( marker );
      const listClass = isOrdered ? 'milkup-ol' : 'milkup-ul';
      
      return `<li class="milkup-li" data-indent="${indent}">${marker} ${text}</li>`;
    }
    
    // Regular paragraph
    if( line.trim() )
    {
      return `<p class="milkup-paragraph">${this.renderInline(line)}</p>`;
    }
    
    return '';
  }
  
  renderInline( text )
  {
    // Bold and italic
    text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="milkup-bold"><em class="milkup-italic">***$1***</em></strong>');
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="milkup-bold">**$1**</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em class="milkup-italic">*$1*</em>');
    
    // Strikethrough
    text = text.replace(/~~(.+?)~~/g, '<del class="milkup-strikethrough">~~$1~~</del>');
    
    // Inline code
    text = text.replace(/`(.+?)`/g, '<code class="milkup-code">`$1`</code>');
    
    // Images (process first to avoid conflicts)
    text = text.replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" class="milkup-image">');
    
    // Links (hide markdown syntax, show only on edit)
    text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="milkup-link">$1</a>');
    
    // Auto-links (avoid matching already processed links)
    text = text.replace(/(^|[^"(])(https?:\/\/[^\s<>"()]+)/g, '$1<a href="$2" class="milkup-link">$2</a>');
    
    return text;
  }
  
  getMarkdownForElement( element )
  {
    if( element.classList.contains('milkup-link') )
    {
      return `[${element.textContent}](${element.href})`;
    }
    
    if( element.classList.contains('milkup-image') )
    {
      return `![${element.alt}](${element.src})`;
    }
    
    if( element.classList.contains('milkup-blockquo') )
    {
      return `> ${element.textContent}`;
    }
    
    if( element.classList.contains('milkup-hr') )
    {
      return '---';
    }
    
    return element.textContent;
  }
  
  
  escapeHtml( text )
  {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  setContent( content )
  {
    this.content = content;
    this.render();
  }
  
  getContent()
  {
    return this.content;
  }
  
  save()
  {
    if( ! this.options.saveUrl ) return;
    
    // Clean content: trim and add single newline at end
    const cleanContent = this.content.trim() + '\n';
    
    fetch( this.options.saveUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'save_markdown',
        content: cleanContent
      })
    })
    .then( response => response.json() )
    .then( data => {
      if( data.success )
      {
        console.log('Content saved successfully');
      }
    })
    .catch( error => {
      console.error('Save error:', error);
    });
  }
}
