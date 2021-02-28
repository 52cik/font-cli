const preview = (names: string[]) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>iconfont preview</title>
  <style type="text/css">
  .icon { width: 1em; height: 1em; vertical-align: -0.15em; fill: currentColor; overflow: hidden; }
  .tag { display: inline-block; width: 320px; padding: 3px 5px; margin: 8px 4px; border: 1px solid #ddd; border-radius: 3px; }
  </style>
  <script src="./font.js"></script>
</head>
<body>
  ${names.map((name) => `
  <div class="tag">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="#${name}"></use>
    </svg>
    <span>${name}</span>
  </div>
  `).join('')}
</body>
</html>
`.trimStart();

export default preview;
