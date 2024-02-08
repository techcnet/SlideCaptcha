<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Example 2</title>
  <script type="text/javascript" src="SlideCaptcha.js"></script>
  <link rel="stylesheet" type="text/css" href="SlideCaptcha.css"/>
  <style>
    form{position:absolute;top:50%;left:50%;transform:translateX(-50%) translateY(-50%)}
  </style>
</head>
<body>
  <form method="POST" autocomplete="off" action="">
    <input type="hidden" name="send" value="1" />
    <h1>Form submit...</h1>
    <p>with SlideCaptcha on a checkbox.</p>
    <?php
      session_start();
      if ((isset($_POST['send'])) && ($_POST['send'] == '1')) {
        // Check if captcha was really solved. SlideCaptchaOk is defined in SlideCaptcha.php.
        if ((isset($_SESSION['SlideCaptchaOk'])) && ($_SESSION['SlideCaptchaOk'] == 'ok')) {
          unset($_SESSION['SlideCaptchaOk']);
          echo '<p style="color:lime">Form submit received: Captcha solved</p>';
        } else {
          echo '<p style="color:red">Form submit received: Captcha NOT solved.</p>';
        }
      }
    ?>
    <noscript style="color:red"><p>JavaScript is not enabled.</p></noscript>
    <script>
      function captcha(checkbox) {
        slideCaptcha.init();
        slideCaptcha.show();
        slideCaptcha.onsuccess(function () {
          document.getElementById(checkbox).checked = true;
          slideCaptcha.hide();
          slideCaptcha.refresh();
        });
      }
    </script>
    <label style="display:block;margin-bottom:20px;cursor:pointer;"><input id="id_checkbox" type="checkbox" required="required" onclick="javascript:captcha('id_checkbox');return false;" />&nbsp;I'm not a robot</label>
    <button>Submit</button>
  </form>
</body>
</html>