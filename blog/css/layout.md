[comment]: <css> (title: '常用的布局写法', keywords: 'layout', date: '2020-9-4')

## CSS常用的布局写法

### 两栏布局
通常是一侧固定宽度，另一侧自适应宽度
```html
<div class="container">
  <div class="left">left</div>
  <div class="content">content</div>
</div>
```

```css
.left { float: left; width: 100px; }
.content { margin-left: 100px; }
/* 或者触发BFC */
.content { overflow: hidden; }
```

```css
.container { overflow: hidden }
.left { float: left; width: 100px; }
.content { float: left/* right */; width: calc(100% - 100px); }
```

```css
.container { font-size: 0; }
.left, .content {
  display: inline-block;
  vertical-align: top;
  font-size: 16px;
}
.left { width: 100px; }
.content { width: calc(100% - 100px); }
```

```css
.left { position: absolute; width: 100px; }
.content { margin-left: 100px; }
```

```css
.container { display: flex; }
.left { flex: 0 0 100px; }
.content { flex: 1; }
```

以上是常用的一些两栏布局方法，flex是最好的，它可以让left和content保持同等的高度。

### 三栏布局
最常见的就是左右两侧固定宽度，中间自适应，例如双飞翼布局，圣杯布局

```html
<div class="container">
  <div class="left">left</div>
  <div class="right">right</div>
  <div class="content">content放在最后</div>
</div>
```

```css
.left { float: left; }
.right { float: right; }
.content { margin: 0 100px; }
/* 或者触发BFC */
.content { overflow: hidden; }
```

```html
<div class="container" style="overflow: hidden">
  <div class="content">content写在前面可以优先渲染</div>
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

```css
/* 圣杯布局 */
.container { padding: 0 100px; }
.left {
  float: left; margin-left: -100%; width: 100px;
  position: relative; left: -100px;
}
.right {
  float: left; margin-left: -100px; width: 100px;
  position: relative; left: 100px;
}
.content { float: left; width: 100%; }
```

```css
.container { display: flex; }
.left { order: -1; flex: 0 0 100px; }
.right { flex: 0 1 100px; }
.content { flex-grow: 1; }
```

```html
<div class="container">
  <div class="content-wrap">
    <div class="content">双飞翼布局</div>
  <div>
  <div class="left"></div>
  <div class="right"></div>
</div>
```

```css
.content-wrap { float: left; width: 100%; }
.content { margin: 0 100px; }
.left { float: left; margin-left: -100%; width: 100px; }
.right { float: left; margin-left: -100px; width: 100px; }
```

当然三栏布局也可以用`inline-block`或者绝对定位来实现，可以参考两栏布局的实现。
