import fs from 'fs'
import path from 'path'

// Check if this is a windows runtime or not
var WIN = /^win/.test(process.platform);

// Captures component id (e.g 'feedback_form' from 'feedback/feedback_form').
var COMPONENT_ID_PATTERN = WIN ? /([^\\]+)$/ : /[^\/]*$/


var getResolvedFile = function (filePath, exts, callback) {
    var enclosingDirPath = filePath || '';
    var captured = enclosingDirPath.match(COMPONENT_ID_PATTERN);
    if (captured) {
        var componentId = captured[1];
        var extObjs = exts.reduce(function(allExts, ext) {
            allExts.push(
                { ext: ext, file: true },
                { ext: ext, file: false }
            )
            return allExts
        }, [])

        var tryToFindExtension = function (index) {
            var extObj = extObjs[index];
            // None of passed extensions are found
            if (!extObj) {
                return callback(false);
            }
            var componentFileName, componentFilePath;
            // Try to load regular file
            if (extObj.file) {
                componentFileName = componentId + '.' + extObj.ext;
                componentFilePath = enclosingDirPath + '.' + extObj.ext;
            } else {
                componentFileName = componentId + '.' + extObj.ext;
                componentFilePath = path.join(enclosingDirPath, componentFileName);
            }
            fs.stat(componentFilePath, function (err, stats) {
                if (err || !stats.isFile()) {
                    return tryToFindExtension(index + 1);
                }
                callback(componentFilePath)
            });
        };
        tryToFindExtension(0);
    }
}

/**
 * @param pathRegExp
 * @param pathReplacement
 * @param exts
 * @constructor
 */
var AliasOverridePlugin = function(pathRegExp, pathReplacement, exts) {
    this.pathRegExp = pathRegExp;
    this.pathReplacement = pathReplacement;
    this.exts = exts || ['jsx', 'js', 'scss', 'css']
}

AliasOverridePlugin.prototype.apply = function (resolver) {
    var pathRegExp = this.pathRegExp;
    var pathReplacement = this.pathReplacement;
    var exts = this.exts;

    resolver.plugin("normal-module-factory", function(nmf) {
        nmf.plugin("before-resolve", function(result, callback) {
            if(!result) return callback();

            // test the request for a path match
            if(pathRegExp.test(result.request)) {
                var filePath = result.request.replace(pathRegExp, pathReplacement)
                getResolvedFile(filePath, exts, function(file) {
                    if (typeof file === 'string') {
                        console.log('[path-override] '+result.request+' => '+file)
                        result.request = file;
                    }
                    return callback(null, result);
                })
            } else {
                return callback(null, result);
            }
        });
    });
};

module.exports = AliasOverridePlugin