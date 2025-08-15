<?php
if( ! isset($input['content']) )
{
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Content is required']);
  exit;
}

$content = $input['content'];

// Validate content (basic security)
if( strlen($content) > 1000000 ) // 1MB limit
{
  http_response_code(413);
  echo json_encode(['success' => false, 'error' => 'Content too large']);
  exit;
}

// Save to demo.md file
$result = file_put_contents('demo.md', $content);

if( $result === false )
{
  http_response_code(500);
  echo json_encode(['success' => false, 'error' => 'Failed to save file']);
  exit;
}

echo json_encode([
  'success' => true,
  'message' => 'Content saved successfully',
  'bytes' => $result
]);
?>
