# path-override-webpack-plugin

[![Build Status](https://travis-ci.org/jamiehill/path-override-webpack-plugin.svg?branch=master)](https://travis-ci.org/jamiehill/path-override-webpack-plugin)

[Webpack](http://webpack.github.io) plugin that provides a convenience to override modules `require` paths, with an external set of matching files.

## Idea

Webpack has a comprehensive [aliasing](http://webpack.github.io/docs/configuration.html#resolve-alias) mechanism, that can be used to point paths to different locations.  This essentially doe sthe same, with one difference.  When specifying an override for a certain path, if a matching file exists at the override location, it will be resolved instead of the original file.  If not file exists, the original file is resolved.

The plugin was conceived as a solution to `skinning` a vanilla application, where any of the original application dependencies, could be directly override with an alternative.

``` js
// SomeView.js  
import 'app/view/SomeView.scss'

// SomeParent.js  
import SomeView from 'app/view/SomeView'
```

Say we want to override the styles and view with different files, we'd simply add a path override config, providing the files to use in their place.

``` js
// webpack.config.js
import PathOverridePlugin from 'path-override-webpack-plugin'

const webpackConfig = {
    plugins: [
        new PathOverridePlugin(/^app\/view/, './node_modules/SomeExternalSkin/src')
    ]
}

```

## Installation

Install via [npm](https://www.npmjs.com/package/path-override-webpack-plugin):

```
npm install --save-dev path-override-webpack-plugin
```

## Roadmap

*

--

[_License (MIT)_](https://github.com/jamiehill/path-override-webpack-plugin/blob/master/docs/LICENSE.md)