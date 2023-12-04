<?php

/*
  HEADER
  
*/

class SlideCaptcha {
  private $im = null;
  private $imFullBg = null;
  private $imBg = null;
  private $imSlide = null;
  private $imWidth = 240;
  private $imHeight = 150;
  private $markWidth = 50;
  private $markHeight = 50;
  private $x = 0;
  private $y = 0;
  private $puzzle = 1;
  private $bgImgPath = '';
  private $puzzle1ImgPath = '';
  private $puzzle2ImgPath = '';
  
  const sessionX = 'SlideCaptchaX';
  const sessionErrorCount = 'SlideCaptchaErrorCount';
  
  public function __construct($imWidth = 240, $imHeight = 150, $markWidth = 50, $markHeight = 50) {
    $this->imWidth = $imWidth;
    $this->imHeight = $imHeight;
    $this->markWidth = $markWidth;
    $this->markHeight = $markHeight;
    $this->bgImgPath = dirname(__FILE__).'/backgrounds/';
    $this->puzzle1ImgPath = dirname(__FILE__).'/puzzle1/';
    $this->puzzle2ImgPath = dirname(__FILE__).'/puzzle2/';
    if (!isset($_SESSION)) {
      session_start();
    }
  }

  public function __destruct() {
    is_resource($this->im) && imagedestroy($this->im);
    is_resource($this->imFullBg) && imagedestroy($this->imFullBg);
    is_resource($this->imBg) && imagedestroy($this->imBg);
    is_resource($this->imSlide) && imagedestroy($this->imSlide);
  }

  private function init() {
    $imgList = glob($this->bgImgPath.'*');
    $random = array_rand($imgList, 1);
    $file_bg = $imgList[$random];

    $this->puzzle = rand(1, 4);

    $this->imFullBg = imagecreatefrompng($file_bg);
    $this->imBg = imagecreatetruecolor($this->imWidth, $this->imHeight);
    imagecopy($this->imBg, $this->imFullBg, 0, 0, 0, 0, $this->imWidth, $this->imHeight);

    $this->imSlide = imagecreatetruecolor($this->markWidth, $this->imHeight);

    $this->y = mt_rand(0, $this->imHeight - $this->markHeight - 1);
    $this->x = mt_rand(50, $this->imWidth - $this->markWidth - 1);

    $_SESSION[self::sessionX] = $this->x;
    $_SESSION[self::sessionErrorCount] = 0;
  }

  private function merge() {
    $this->im = imagecreatetruecolor($this->imWidth, $this->imHeight * 3);
    imagecopy($this->im, $this->imBg, 0, 0, 0, 0, $this->imWidth, $this->imHeight);
    imagecopy($this->im, $this->imSlide, 0, $this->imHeight, 0, 0, $this->markWidth, $this->imHeight);
    imagecopy($this->im, $this->imFullBg, 0, $this->imHeight * 2, 0, 0, $this->imWidth, $this->imHeight);
    imagecolortransparent($this->im, 0);
  }

  private function createBg() {
    $file_mark = $this->puzzle1ImgPath.$this->puzzle.'.png';
    $im = imagecreatefrompng($file_mark);
    imagecolortransparent($im, 0);
    imagecopy($this->imBg, $im, $this->x, $this->y, 0, 0, $this->markWidth, $this->markHeight);
    imagedestroy($im);
  }

  private function createSlide() {
    $file_mark = $this->puzzle2ImgPath.$this->puzzle.'.png';
    $img_mark = imagecreatefrompng($file_mark);
    imagecopy($this->imSlide, $this->imFullBg, 0, $this->y, $this->x, $this->y, $this->markWidth, $this->markHeight);
    imagecopy($this->imSlide, $img_mark, 0, $this->y, 0, 0, $this->markWidth, $this->markHeight);
    imagecolortransparent($this->imSlide, 0);
    imagedestroy($img_mark);
  }

  public function build() {
    $this->init();
    $this->createSlide();
    $this->createBg();
    $this->merge();
    header('Content-Type: image/png');
    imagetruecolortopalette($this->im, true, 16);
    imagepng($this->im, null, 9);
  }

  public function check($offset, $errorTolerance = 3) {
    if (!isset($_SESSION[self::sessionX])) {
        return false;
    }
    $result = abs($_SESSION[self::sessionX] - $offset) <= $errorTolerance;
    if ($result) {
        unset($_SESSION[self::sessionX]);
        $_SESSION[self::sessionErrorCount] = 0;
    } else {
        $_SESSION[self::sessionErrorCount]++;
        if ($_SESSION[self::sessionErrorCount] > 5) {
            unset($_SESSION[self::sessionX]);
            $_SESSION[self::sessionErrorCount] = 0;
        }
    }
    return $result;
  }
}