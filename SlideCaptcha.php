<?php

/*
  HEADER
  
*/

  session_start();

  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');
  header('Pragma: no-cache');

  require_once('SlideCaptcha/SlideCaptchaClass.php');

  if (isset($_GET['action'])) {
    if ($_GET['action'] == 'get') {
      $slideCaptcha = new \SlideCaptcha();
      $slideCaptcha->build();
    }
    if ($_GET['action'] == 'check') {
      $slideCaptcha = new \SlideCaptcha();
      if (isset($_GET['x'])) {
        $x = $_GET['x'];
        if (ctype_digit(strval($x))) {
          if ($slideCaptcha->check($x, 3)) {
            $_SESSION['SlideCaptchaOk'] = 'ok';
            echo 'ok';
          } else {
            echo 'error';
          }
        }
      }
    }
  }
?>