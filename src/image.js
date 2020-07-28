// 图片打包 图片引入方式
// 1.js引入
import logo from './logo.png'; //返回的是一个新的图片
let image = new Image();
image.src = logo;
document.body.appendChild(image);
// 2. css中引入   @import './index.css'

