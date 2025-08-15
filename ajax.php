<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);

if( ! $input || ! isset($input['action']) )
{
  http_response_code(400);
  echo json_encode(['success' => false, 'error' => 'Invalid request']);
  exit;
}

$action = $input['action'];

switch( $action )
{
  case 'save_markdown':
    include 'ajax/save_markdown.php';
    break;
    
  default:
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Action missing']);
    break;
}
?>
