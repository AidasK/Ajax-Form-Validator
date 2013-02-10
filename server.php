<?php 
$errors = array();
if (!isset($_POST['username']) || !$_POST['username']) {
    $errors['username'] = 'Username is required';
}
if (!isset($_POST['password']) || !$_POST['password']) {
    $errors['password'] = 'Password is required';
}
// Is ajax?
if(isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
    echo json_encode($errors);
    return ;
}

if (empty($errors)) {
    echo "Success";
} else {
    echo "Fail";
}
?>
