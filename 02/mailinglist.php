<?php
header('Access-Control-Allow-Origin: *');

require 'phpmailer/PHPMailerAutoload.php';
//Create a new PHPMailer instance
$mail = new PHPMailer;
// Set PHPMailer to use the sendmail transport
$mail->isSendmail();
//Set who the message is to be sent from
$mail->setFrom('admin@mitzo.sg', 'Mitzo');
//Set who the message is to be sent to
$mail->addAddress('marcom@parkhotelgroup.com', 'Mitzo');
//Set the subject line
$mail->Subject = 'Mailing list on Mitzo web site';

//Read an HTML message body from an external file, convert referenced images to embedded,
$message = file_get_contents('mailinglist-edm.html'); 
$message = str_replace('%email%', $_POST['email'], $message); 

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