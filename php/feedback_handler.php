<?php
    // Captcha code
    function post_captcha($user_response) {
        $fields_string = '';
        $fields = array(
            'secret' => '6LfH6CYUAAAAANcQkuFA83rG-xmPGZEAyH26llxv',
            'response' => $user_response
        );
        foreach($fields as $key=>$value)
        $fields_string .= $key . '=' . $value . '&';
        $fields_string = rtrim($fields_string, '&');
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);
        $result = curl_exec($ch);
        curl_close($ch);
        return json_decode($result, true);
    }
    // Call the function post_captcha
    $res = post_captcha($_POST['g-recaptcha-response']);
    if (!$res['success']) {
        // What happens when the CAPTCHA wasn't checked
        echo '<p>Please go back and make sure you check the security CAPTCHA box.</p><br>';
    } else {
        // If CAPTCHA is successfully completed...
    		$name=$_POST['name'];
    		$email=$_POST['email'];
    		$phone=$_POST['phone'];
    		$msg=$_POST['msg'];
    		$to='email@here.com'; // Receiver Email ID, Replace with your email ID
    		$subject='New Feedback';
    		$message="Name :".$name."\n"."Phone :".$phone."\n"."Wrote the following :"."\n\n".$msg;
    		$headers="From: email@here.com";
    		if(mail($to, $subject, $message, $headers)){
                header("Location: ../index.html");
    		}
    }
?>
