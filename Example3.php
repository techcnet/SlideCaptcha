<?php
  session_start();
  // Check if captcha was really solved. SlideCaptchaOk is defined in SlideCaptcha.php.
  if ((isset($_SESSION['SlideCaptchaOk'])) && ($_SESSION['SlideCaptchaOk'] == 'ok')) {
    unset($_SESSION['SlideCaptchaOk']);
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="Example3.php"');
    readfile('Example3.php');
    die();
  }
?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Example 3</title>
  <script type="text/javascript" src="SlideCaptcha.js"></script>
  <link rel="stylesheet" type="text/css" href="SlideCaptcha.css"/>
  <style> 
    #center{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%)}
  </style>
</head>
<body>
  <div id="center">
    <h1>Download-Hyperlink...</h1>
    <p>with SlideCaptcha.</p>
    <noscript style="color:red"><p>JavaScript is not enabled.</p></noscript>
    <script>
      function captcha(file) {
        slideCaptcha.onsuccess(function () {
          window.location.href = file;
          slideCaptcha.hide();
          slideCaptcha.refresh();
        });
        slideCaptcha.init();
        slideCaptcha.show();
      }
    </script>
    <a href="" onclick="javascript:captcha('Example3.php');return false;">DOWNLOAD</a>
  </div>
</body>
</html>