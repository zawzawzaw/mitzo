<?php
header('Access-Control-Allow-Origin: *');

require 'phpmailer/PHPMailerAutoload.php';
//Create a new PHPMailer instance
$mail = new PHPMailer;
// Set PHPMailer to use the sendmail transport
$mail->isSendmail();
//Set who the message is to be sent from
$mail->setFrom($_POST['email'], $_POST['first_name'] . ' ' . $_POST['first_name']);
//Set an alternative reply-to address
$mail->addReplyTo($_POST['email'], $_POST['first_name'] . ' ' . $_POST['first_name']);
//Set who the message is to be sent to
$mail->addAddress('rsvn@mitzo.sg', 'Mitzo');
//Set the subject line
$mail->Subject = 'New reservation received on Mitzo web site';

//Read an HTML message body from an external file, convert referenced images to embedded,
$message = file_get_contents('edm.html'); 
$message = str_replace('%first_name%', $_POST['first_name'], $message); 
$message = str_replace('%last_name%', $_POST['last_name'], $message); 
$message = str_replace('%phone%', $_POST['phone'], $message); 
$message = str_replace('%mobile%', $_POST['mobile'], $message); 
$message = str_replace('%email%', $_POST['email'], $message); 
$message = str_replace('%subject%', $_POST['subject'], $message); 
$message = str_replace('%message%', $_POST['message'], $message); 
$message = str_replace('%date%', $_POST['date'], $message);
$message = str_replace('%time%', $_POST['time'], $message);
$message = str_replace('%party_size%', $_POST['party_size'], $message);

$mail->msgHTML($message, dirname(__FILE__));
//Replace the plain text body with one created manually
$mail->AltBody = 'This is a plain-text message body';
//send the message, check for errors
if (!$mail->send()) {
    echo false;
} else {
    echo true;
}
?>