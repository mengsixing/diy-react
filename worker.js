importScripts('//unpkg.com/babel-standalone@6.26.0/babel.min.js');

onmessage = function() {
  fetch(`test.js`)
    .then(resp=>resp.text())
    .then(text=>{
      const js = Babel.transform(text, { 
        presets: ['react'] ,  
        plugins: ["transform-object-rest-spread"]
      }).code;
      postMessage(js);
    })
}
