<?php
$demoContent = file_get_contents('demo.md');
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Milkup - Live Markdown Editor</title>
  <link rel="stylesheet" href="milkup.css">
  <style>
    body
    {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f8f9fa;
    }
    
    .container
    {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header
    {
      background: linear-gradient(135deg, #007acc, #0056b3);
      color: white;
      padding: 30px;
      text-align: center;
    }
    
    .header h1
    {
      margin: 0;
      font-size: 2.5em;
      font-weight: 300;
    }
    
    .header p
    {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 1.1em;
    }
    
    .editor-container
    {
      padding: 0;
    }
    
    .milkup-editor
    {
      border: none;
      border-radius: 0;
      min-height: 600px;
    }
    
    .save-status
    {
      padding: 15px 30px;
      background: #e8f5e8;
      color: #2d5a2d;
      text-align: center;
      display: none;
    }
    
    .save-status.show
    {
      display: block;
    }
    
    @media (max-width: 768px)
    {
      body
      {
        padding: 10px;
      }
      
      .header
      {
        padding: 20px;
      }
      
      .header h1
      {
        font-size: 2em;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Milkup</h1>
      <p>Live Markdown Editor - Edit and see results instantly</p>
    </div>
    
    <div class="save-status" id="saveStatus">
      Content saved successfully!
    </div>
    
    <div class="editor-container">
      <div id="editor" data-content="<?php echo htmlspecialchars($demoContent); ?>"></div>
    </div>
  </div>

  <script src="milkup.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function()
    {
      const editorElement = document.getElementById('editor');
      const initialContent = editorElement.getAttribute('data-content');
      
      const editor = new Milkup('#editor', {
        saveUrl: 'ajax.php',
        autoSave: false
      });
      
      editor.setContent( initialContent );
      
      // Save functionality
      let saveTimeout;
      const saveStatus = document.getElementById('saveStatus');
      
      // Auto-save after 2 seconds of inactivity
      editorElement.addEventListener('input', function()
      {
        clearTimeout( saveTimeout );
        saveTimeout = setTimeout(() => {
          editor.save();
          showSaveStatus();
        }, 2000);
      });
      
      function showSaveStatus()
      {
        saveStatus.classList.add('show');
        setTimeout(() => {
          saveStatus.classList.remove('show');
        }, 2000);
      }
      
      // Manual save with Ctrl+S
      document.addEventListener('keydown', function( e )
      {
        if( e.ctrlKey && e.key === 's' )
        {
          e.preventDefault();
          editor.save();
          showSaveStatus();
        }
      });
    });
  </script>
</body>
</html>
