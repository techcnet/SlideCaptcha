<?php

/*
  This script is part of the SlideCaptcha and must be located in the root directory.
  This script is called by SlideCaptcha.js (defined in "_php_url" in SlideCaptcha.js) which must be also located in the root directory.
*/

  session_start();

  header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
  header('Expires: Sat, 26 Jul 1997 05:00:00 GMT');
  header('Pragma: no-cache');

  require_once('SlideCaptcha/SlideCaptchaClass.php');

  // errorTolerance of 0 means zero tolerance.
  // errorTolerance of 3 means +- 3 pixel tolerance (recommended).
  $errorTolerance = 3;

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
          if ($slideCaptcha->check($x, $errorTolerance)) {
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