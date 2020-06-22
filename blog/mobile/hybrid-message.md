[meta]: <mobile> (title: 'Hybrid通信方案', keywords: 'hybrid')

## Hybrid通信方案

* 从原生调用js
  * Android 可以使用
  ```java
  mWebView.evaluateJavascript("javascript: 方法名('参数,需要转为字符串')", new ValueCallback() {
      @Override
      public void onReceiveValue(String value) {
        //这里的value即为对应JS方法的返回值
      }
  });
  ```
