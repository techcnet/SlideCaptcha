var slideCaptcha = {
  _obj: null,
  _slideCaptcha: null,
  _img: null,
  _img_loaded: false,
  _is_draw_bg: false,
  _is_moving: false,
  _block_start_x: 0,
  _block_start_y: 0,
  _doing: false,
  _mark_w: 50,
  _mark_h: 50,
  _mark_offset: 0,
  _img_w: 240,
  _img_h: 150,
  _php_url: '/SlideCaptcha.php',
  _result: false,
  _err_c: 0,
  _onsuccess: null,
  _bind: function (elm, evType, fn) {
    if (elm.addEventListener) {
      elm.addEventListener(evType, fn);
      return true;
    } else if (elm.attachEvent) {
      var r = elm.attachEvent(evType, fn);
      return r;
    }
  },
  _block_start_move: function (e) {
    if (slideCaptcha._doing || !slideCaptcha._img_loaded) {
      return;
    }
    e.preventDefault();
    var theEvent = window.event || e;
    if (theEvent.touches) {
      theEvent = theEvent.touches[0];
    }
    document.getElementById('slide_captcha_slide_text').style.display = 'none';
    slideCaptcha._draw_bg();
    slideCaptcha._block_start_x = theEvent.clientX;
    slideCaptcha._block_start_y = theEvent.clientY;
    slideCaptcha._doing = true;
    slideCaptcha._is_moving = true;
  },
  _block_on_move: function (e) {
    if (!slideCaptcha._doing) return true;
    if (!slideCaptcha._is_moving) return true;
    e.preventDefault();
    var theEvent = window.event || e;
    if (theEvent.touches) {
      theEvent = theEvent.touches[0];
    }
    slideCaptcha._is_moving = true;
    var offset = theEvent.clientX - slideCaptcha._block_start_x;
    if (offset < 0) {
      offset = 0;
    }
    var max_off = slideCaptcha._img_w - slideCaptcha._mark_w;
    if (offset > max_off) {
      offset = max_off;
    }
    var obj = document.getElementById('slide_captcha_slider');
    obj.style.cssText = 'transform: translate(' + offset + 'px, 0px)';
    slideCaptcha._mark_offset = offset / max_off * (slideCaptcha._img_w - slideCaptcha._mark_w);
    slideCaptcha._draw_bg();
    slideCaptcha._draw_mark();
  },
  _block_on_end: function (e) {
    if (!slideCaptcha._doing) return true;
    e.preventDefault();
    var theEvent = window.event || e;
    if (theEvent.touches) {
      theEvent = theEvent.touches[0];
    }
    slideCaptcha._is_moving = false;
    slideCaptcha._send_result();
  },
  _send_result: function () {
    slideCaptcha._result = false;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200) {
        slideCaptcha._send_result_success(xhr.responseText, xhr.responseXML);
      }
    };
    xhr.open('GET', slideCaptcha._php_url + '?action=check&x=' + Math.trunc(slideCaptcha._mark_offset) + '&t=' + Math.random(), true);
    xhr.send(null);
  },
  _send_result_success: function (responseText, responseXML) {
    slideCaptcha._doing = false;
    if (responseText == 'ok') {
      slideCaptcha._showmsg('Correct', 1);
      slideCaptcha._err_c = 0;
      slideCaptcha._result = true;
      document.getElementById('slide_captcha_splash').style.display = 'block';
      setTimeout(function () {
        slideCaptcha.hide;
        if (slideCaptcha._onsuccess) {
          slideCaptcha._onsuccess();
        }
      }, 3000);
    } else {
      var obj = document.getElementById('slide_captcha_div');
      if (!slideCaptcha.hasClass(obj, 'dd')) {
        obj.className += ' ' + 'dd';
      }
      setTimeout(function () {
        if (slideCaptcha.hasClass(obj, 'dd')) {
          obj.className = obj.className.replace(new RegExp("(\\s|^)" + 'dd' + "(\\s|$)"), ' ');
        }
      }, 200);
      slideCaptcha._result = false;
      slideCaptcha._showmsg('Wrong!');
      slideCaptcha._err_c++;
      if (slideCaptcha._err_c > 5) {
        slideCaptcha.refresh();
      }
    }
  },
  _draw_fullbg: function () {
    var canvas_bg = document.getElementById('slide_captcha_canvas_background');
    var ctx_bg = canvas_bg.getContext('2d');
    ctx_bg.drawImage(slideCaptcha._img, 0, slideCaptcha._img_h * 2, slideCaptcha._img_w, slideCaptcha._img_h, 0, 0, slideCaptcha._img_w, slideCaptcha._img_h);
  },
  _draw_bg: function () {
    if (slideCaptcha._is_draw_bg) {
      return;
    }
    slideCaptcha._is_draw_bg = true;
    var canvas_bg = document.getElementById('slide_captcha_canvas_background');
    var ctx_bg = canvas_bg.getContext('2d');
    ctx_bg.drawImage(slideCaptcha._img, 0, 0, slideCaptcha._img_w, slideCaptcha._img_h, 0, 0, slideCaptcha._img_w, slideCaptcha._img_h);
  },
  _draw_mark: function () {
    var canvas_mark = document.getElementById('slide_captcha_canvas_mark');
    var ctx_mark = canvas_mark.getContext('2d');
    ctx_mark.clearRect(0, 0, canvas_mark.width, canvas_mark.height);
    ctx_mark.drawImage(slideCaptcha._img, 0, slideCaptcha._img_h, slideCaptcha._mark_w, slideCaptcha._img_h, slideCaptcha._mark_offset, 0, slideCaptcha._mark_w, slideCaptcha._img_h);
    var imageData = ctx_mark.getImageData(0, 0, slideCaptcha._img_w, slideCaptcha._img_h);
    var data = imageData.data;
    var x = slideCaptcha._img_h, y = slideCaptcha._img_w;
    for (var j = 0; j < x; j++) {
      var ii = 1, k1 = -1;
      for (var k = 0; k < y && k >= 0 && k > k1;) {
        var i = (j * y + k) * 4;
        k += ii;
        var r = data[i], g = data[i + 1], b = data[i + 2];
        if (r + g + b < 200) data[i + 3] = 0;
        else {
          var arr_pix = [1, -5];
          var arr_op = [250, 0];
          for (var i = 1; i < arr_pix[0] - arr_pix[1]; i++) {
            var iiii = arr_pix[0] - 1 * i;
            var op = parseInt(arr_op[0] - (arr_op[0] - arr_op[1]) / (arr_pix[0] - arr_pix[1]) * i);
            var iii = (j * y + k + iiii * ii) * 4;
            data[iii + 3] = op;
          }
          if (ii == -1) {
            break;
          }
          k1 = k;
          k = y - 1;
          ii = -1;
        }
      }
    }
    ctx_mark.putImageData(imageData, 0, 0);
  },
  _reset: function () {
    slideCaptcha._mark_offset = 0;
    slideCaptcha._draw_bg();
    slideCaptcha._draw_mark();
    document.getElementById('slide_captcha_slider').style.cssText = 'transform: translate(0px, 0px)';
  },
  show: function () {
    document.getElementById('slide_captcha_splash').style.display = 'none';
    document.getElementById('slide_captcha_background').style.display = 'block';
    document.getElementById('slide_captcha_div').style.display = 'block';
  },
  hide: function () {
    setTimeout(function () {
      document.getElementById('slide_captcha_background').style.display = 'none';
      document.getElementById('slide_captcha_div').style.display = 'none';
    }, 500);
  },
  _showmsg: function (msg, status) {
    if (!status) {
      status = 0;
      var obj = document.getElementById('slide_captcha_msg_error');
    } else {
      var obj = document.getElementById('slide_captcha_msg_ok');
    }
    obj.innerHTML = msg;
    var setOpacity = function (ele, opacity) {
      if (ele.style.opacity != undefined) {
        ele.style.opacity = opacity / 100;
      } else {
        ele.style.filter = 'alpha(opacity=' + opacity + ')';
      }
    };

    function fadeout(ele, opacity, speed) {
      if (ele) {
        var v = ele.style.filter.replace('alpha(opacity=', '').replace(')', '') || ele.style.opacity || 100;
        v < 1 && (v = v * 100);
        var count = speed / 1000;
        var avg = (100 - opacity) / count;
        var timer = null;
        timer = setInterval(function () {
          if (v - avg > opacity) {
            v -= avg;
            setOpacity(ele, v);
          } else {
            setOpacity(ele, 0);
            if (status == 0) {
              slideCaptcha._reset();
            }
            clearInterval(timer);
          }
        }, 100);
      }
    }

    function fadein(ele, opacity, speed) {
      if (ele) {
        var v = ele.style.filter.replace('alpha(opacity=', '').replace(')', '') || ele.style.opacity;
        v < 1 && (v = v * 100);
        var count = speed / 1000;
        var avg = count < 2 ? (opacity / count) : (opacity / count - 1);
        var timer = null;
        timer = setInterval(function () {
          if (v < opacity) {
            v += avg;
            setOpacity(ele, v);
          } else {
            clearInterval(timer);
            setTimeout(function () {
              fadeout(obj, 0, 6000);
            }, 1000);
          }
        }, 100);
      }
    }

    fadein(obj, 80, 4000);
  },
  _html: function () {
    var d = document.getElementById('slide_captcha_background');
    if (d) return;
    var html = '<div id="slide_captcha_background"></div><div id="slide_captcha_div"><div id="slide_captcha_loading">Loading...</div><canvas id="slide_captcha_canvas_background"></canvas><canvas id="slide_captcha_canvas_mark"></canvas><div id="slide_captcha_splash"></div><div id="slide_captcha_msg_error"></div><div id="slide_captcha_msg_ok"></div><div id="slide_captcha_slide_background"><div id="slide_captcha_slider"></div><div id="slide_captcha_slide_text">Drag the slider to complete the puzzle</div></div><div id="slide_captcha_toolbar"><div id="slide_captcha_close"></div><div id="slide_captcha_refresh"></div><div id="slide_captcha_info" onclick="alert(\'This is a test, used to determine, whether the user is human, in order to deter bot attacks and spam. Drag the slider to the right, to complete the puzzle.\\n\\nPhotos by: unsplash.com\');"></div></div></div>';
    var bo = document.getElementsByTagName('body');
    slideCaptcha.appendHTML(bo[0], html);
  },
  refresh: function () {
    var _this = this;
    slideCaptcha._err_c = 0;
    slideCaptcha._is_draw_bg = false;
    slideCaptcha._result = false;
    slideCaptcha._img_loaded = false;
    var obj = document.getElementById('slide_captcha_canvas_background');
    obj.style.display = 'none';
    obj = document.getElementById('slide_captcha_canvas_mark');
    obj.style.display = 'none';
    slideCaptcha._img = new Image();
    var img_url = slideCaptcha._php_url + '?action=get&t=' + Math.random();
    slideCaptcha._img.src = img_url;
    slideCaptcha._img.onload = function () {
      slideCaptcha._draw_fullbg();
      var canvas_mark = document.getElementById('slide_captcha_canvas_mark');
      var ctx_mark = canvas_mark.getContext('2d');
      ctx_mark.clearRect(0, 0, canvas_mark.width, canvas_mark.height);
      slideCaptcha._img_loaded = true;
      obj = document.getElementById('slide_captcha_canvas_background');
      obj.style.display = '';
      obj = document.getElementById('slide_captcha_canvas_mark');
      obj.style.display = '';
    };
    obj = document.getElementById('slide_captcha_slider');
    obj.style.cssText = 'transform: translate(0px, 0px)';
    obj = document.getElementById('slide_captcha_slide_text');
    obj.style.display = 'block';
  },
  init: function () {
    var _this = this;
    if (!slideCaptcha._img) {
      slideCaptcha._html();

      var obj = document.getElementById('slide_captcha_slider');
      slideCaptcha._bind(obj, 'mousedown', _this._block_start_move);
      slideCaptcha._bind(document, 'mousemove', _this._block_on_move);
      slideCaptcha._bind(document, 'mouseup', _this._block_on_end);

      slideCaptcha._bind(obj, 'touchstart', _this._block_start_move);
      slideCaptcha._bind(document, 'touchmove', _this._block_on_move);
      slideCaptcha._bind(document, 'touchend', _this._block_on_end);

      var obj = document.getElementById('slide_captcha_close');
      slideCaptcha._bind(obj, 'touchstart', _this.hide);
      slideCaptcha._bind(obj, 'click', _this.hide);

      var obj = document.getElementById('slide_captcha_refresh');
      slideCaptcha._bind(obj, 'touchstart', _this.refresh);
      slideCaptcha._bind(obj, 'click', _this.refresh);

      document.getElementById('slide_captcha_splash').style.display = 'none';
      slideCaptcha.refresh();
      slideCaptcha._slideCaptcha = this;
      document.getElementById('slide_captcha_background').style.display = 'block';
      document.getElementById('slide_captcha_div').style.display = 'block';
    }
  },
  result: function () {
    return slideCaptcha._result;
  },
  onsuccess: function (fn) {
    slideCaptcha._onsuccess = fn;
  },
  hasClass: function (elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false;
    var ret = new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    return ret;
  },
  appendHTML: function (o, html) {
    var divTemp = document.createElement('div');
    var nodes = null;
    var fragment = document.createDocumentFragment();
    divTemp.innerHTML = html;
    nodes = divTemp.childNodes;
    for (var i = 0, length = nodes.length; i < length; i += 1) {
      fragment.appendChild(nodes[i].cloneNode(true));
    }
    o.appendChild(fragment);
    nodes = null;
    fragment = null;
  }
};