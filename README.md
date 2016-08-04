# path-override-webpack-plugin

[![Build Status](https://travis-ci.org/jamiehill/path-override-webpack-plugin.svg?branch=master)](https://travis-ci.org/jamiehill/path-override-webpack-plugin)

[Webpack](http://webpack.github.io) plugin that provides a convenience to override modules `require` paths, with an external set of matching files.

## Idea

Although Webpack has a comprehensive `aliasing` configuration, where by swapping out the resolved location of files is easy.  But making this more granular - targeting individual files, or nested subdirectories - can be tiresome to configure in your `webpack.config`

``` js
// SomeView.js  
import 'app/view/SomeView.scss'

// SomeParent.js  
import SomeView from 'app/view/SomeView'
```

Say we want to override the styles and the view with different files (think skinning), we can like this:

``` js
// webpack.config.js
import PathOverridePlugin from 'path-override-webpack-plugin'

const webpackConfig = {
    plugins: [
        new PathOverridePlugin(/^app\/view/, './node_modules/SomeExternalSkin/src')
    ]
}

```