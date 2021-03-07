const preview = () => `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iconfont 预览</title>
  <style type="text/css">
  .icon-list{clear:both;overflow:hidden;margin:40px auto;padding:0;width:1160px;color:#666;list-style:none;font-size:36px;}
  .icon-list li{position:relative;float:left;overflow:visible;margin:15px 13px;width:100px;height:105px;border:1px solid #e0e0e0;border-radius:5px;text-align:center;cursor:pointer;transition:all .4s;user-select:none;}
  .icon-list li:hover{box-shadow:1px 2px 10px #ddd;}
  .icon-list .wrap{display:inline-block;margin-top:18px;}
  .icon-list .icon{overflow:hidden;width:1em;height:1em;vertical-align:middle;font-size:inherit;fill:currentColor;}
  .icon-list .name{display:block;overflow:hidden;margin-top:15px;padding:0 .5em;height:20px;color:#666;text-align:center;text-overflow:ellipsis;white-space:nowrap;font-size:12px;line-height:1.2;}
  .toast{position:fixed;top:16px;right:32px;padding:6px 1.2em;border-radius:4px;background-color:#48c774;color:#fff;font-size:14px;opacity:0;transition:opacity .4s;}
  </style>
  <script src="./font.js"></script>
</head>
<body>
  <script id="tpl-item" type="text/template">
    <div class="wrap">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#@name"></use>
      </svg>
    </div>
    <span class="name">@name</span>
  </script>

  <div class="toast"></div>
  <ul class="icon-list"></ul>

  <script>
    function toast(msg, ms) {
      const node = document.querySelector('.toast');
      node.innerHTML = msg;
      node.style.opacity = 1;
      clearTimeout(toast.intervalId || 0);
      toast.intervalId = setTimeout(() => {
        node.style.opacity = 0;
      }, ms || 2000);
    }

    function copyText(text) {
      const input = document.createElement('input');
      input.value = text;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      toast('复制成功');
    }

    document.addEventListener('DOMContentLoaded', () => {
      const iconList = document.querySelector('.icon-list');
      const tpl = document.querySelector('#tpl-item').innerHTML;
      [...document.querySelectorAll('svg > symbol')].forEach(icon => {
        const li = document.createElement('li');
        li.innerHTML = tpl.replace(/@name/g, icon.id);
        li.onclick = () => copyText(icon.id);
        iconList.appendChild(li);
      });
    }, false);
  </script>
</body>
</html>
`.trimStart();

export default preview;
