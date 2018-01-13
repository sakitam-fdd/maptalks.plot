# maptalks.plot

> 对 `maptalks` 扩展的 `plot symbol` 的自定义绘制插件

[![Build Status](https://travis-ci.org/sakitam-fdd/maptalks.plot.svg?branch=master)](https://www.travis-ci.org/sakitam-fdd/maptalks.plot)
[![codecov](https://codecov.io/gh/sakitam-fdd/maptalks.plot/branch/master/graph/badge.svg)](https://codecov.io/gh/sakitam-fdd/maptalks.plot)
[![NPM downloads](https://img.shields.io/npm/dm/maptalks.plot.svg)](https://npmjs.org/package/maptalks.plot)
![JS gzip size](http://img.badgesize.io/https://unpkg.com/maptalks.plot/dist/maptalks.plot.js?compression=gzip&label=gzip%20size:%20JS)
[![Npm package](https://img.shields.io/npm/v/maptalks.plot.svg)](https://www.npmjs.org/package/maptalks.plot)
[![GitHub stars](https://img.shields.io/github/stars/sakitam-fdd/maptalks.plot.svg)](https://github.com/sakitam-fdd/maptalks.plot/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/sakitam-fdd/maptalks.plot/master/LICENSE)

## 下载


```bash
git clone https://github.com/sakitam-fdd/maptalks.plot.git
npm install
npm run dev
npm run build
```

### 安装

#### npm安装

```bash
npm install maptalks.plot --save
import maptalksPlot from 'maptalks.plot'
```

#### cdn

目前可通过 [unpkg.com](https://unpkg.com/maptalks.plot/dist/maptalks.plot.js) 获取最新版本的资源。

```bash
https://unpkg.com/maptalks.plot/dist/maptalks.plot.js
https://unpkg.com/maptalks.plot/dist/maptalks.plot.min.js
```

#### [示例](//sakitam-fdd.github.io/maptalks.plot/)

##### maptalks demo

``` html
<div id="map" class="container"></div>
<script src="../node_modules/maptalks/dist/maptalks.js"></script>
<script src="../dist/maptalks.plot.js"></script>
<script>
  var map = new maptalks.Map('map', {
      center: [108.93, 34.27],
      zoom: 5,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: 'https://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
      })
    });
  
    var layer = new maptalks.VectorLayer('vector', {
      enableSimplify : false
    }).addTo(map);
  
    var drawTool = new MaptalksPlot.PlotDraw({
      mode: 'Curve'
    }).addTo(map).disable();
    drawTool.on('drawend', function (param) {
      console.log(param.geometry);
      if (param.geometry.getPlotType() === 'PlotPoint') {
        param.geometry.setSymbol({
          'markerFile': './static/images/5.png',
          'markerWidth': 28,
          'markerHeight': 40,
          'markerDx': 0,
          'markerDy': 0,
          'markerOpacity': 1
        })
      }
      layer.addGeometry(param.geometry);
    });
    var itemsRight = ['Polygon',
      'CurveFlag', 'TriangleFlag', 'RectFlag',
      'RectAngle', 'Circle', 'Ellipse'].map(function (value) {
      return {
        item: value,
        click: function () {
          drawTool.setMode(value).enable();
        }
      };
    });
    // right
    new maptalks.control.Toolbar({
      position : 'top-right',
      items: [
        {
          item: 'Shape',
          children: itemsRight
        },
        {
          item: 'Disable',
          click: function () {
            drawTool.disable();
          }
        },
        {
          item: 'Clear',
          click: function () {
            layer.clear();
          }
        }
      ]
    }).addTo(map);
</script>
```


## 截图示例

[![demo](https://raw.githubusercontent.com/sakitam-fdd/maptalks.plot/master/assets/images/plot.jpg)](https://codepen.io/sakitam-fdd/pen/wpXxNW)


## Resources

> [maptalks](https://github.com/maptalks/maptalks.js)
