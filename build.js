'use strict';
var css = require('css');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var CleanCSS = require('clean-css');
var UglifyJS = require('uglify-js');

process.env.NODE_ENV = 'development';
var config = require('./config/config');
var srcPath = './public/';
var destPath = './public/dist/';
var destCssPath = destPath+'/css/';
var destJsPath = destPath+'/js/';

var srcPathsArray = [];

var fs = require('fs');
var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + '/' + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

try {
  deleteFolderRecursive(destPath);
} catch (e){

}

// Copy all resources required by this css into destination directory
var buildCssAssets = function(cssPath){
  var pathString = cssPath;
  var cssContent;
  try{
    cssContent = fs.readFileSync(pathString, {encoding: 'utf-8'});
  } catch(e) {
    if(e.code === 'ENOENT') {
      console.error('Non-existing css referenced in all.js:');
      console.error(cssPath);
      return;
    }
  }

  var cssDirname = path.dirname(pathString);
  var cssName = path.basename(cssPath);
  var parsedContent = css.parse(cssContent);
  var assets = {};

  //Recursively pass through rules to find all asset urls
  function getRulesAssets(rule) {
    var i;
    if(rule.rules) {
      for(i=0; i<rule.rules.length; ++i) {
        getRulesAssets(rule.rules[i]);
      }
    }
    if(rule.declarations) {
      var urlsregex = /url\(.+?\)/ig;
      var nourlRegex = /\'.*?[\'?#]/ig;
      for(i=0; i<rule.declarations.length; ++i) {
        var matches = rule.declarations[i].value.match(urlsregex);
        if(matches){
          for(var j=0; j<matches.length; ++j) {
            var matches2 = matches[j].match(nourlRegex);
            var nourlMatch = matches[j].substring(4, matches[j].length - 1);
            if(matches2) {
              nourlMatch = matches2[0];
            }

            //Strip apostrophe chars
            if(nourlMatch.charAt(0) === '\'') {
              nourlMatch =nourlMatch.substring(1, nourlMatch.length - 1);
            }
            if(nourlMatch.charAt(nourlMatch.length-1) === '?' || nourlMatch.charAt(nourlMatch.length-1) === '#') {
              nourlMatch =nourlMatch.substring(0, nourlMatch.length - 2);
            }
            assets[nourlMatch] = true;
          }
        }
      }
    }
  }

  getRulesAssets(parsedContent.stylesheet);

  //Copy all found assets into destination directory
  var assetKeys = Object.keys(assets);
  for(var i=0; i<assetKeys.length; ++i){
    var realPath = path.resolve(cssDirname, assetKeys[i]);
    var destPath = path.resolve(destCssPath, assetKeys[i]);
    var destDir = path.dirname(destPath);
    mkdirp.sync(destDir);
    fs.createReadStream(realPath).pipe(fs.createWriteStream(destPath));
  }
  //Copy css file from source to destination
  mkdirp.sync(destCssPath);
  srcPathsArray.push(pathString);
  // fs.createReadStream(cssPath).pipe(fs.createWriteStream(destCssPath+'/'+cssName));
};

//Fire up the asset builder
for(var i=0; i<config.assets.css.length; ++i){
  console.log('Building', config.assets.css[i]);
  buildCssAssets(srcPath + config.assets.css[i]);
}

//Minify css files
mkdirp.sync(destCssPath);
new CleanCSS({rebase: false}).minify(srcPathsArray, function(errors, minified){
  fs.writeFileSync(destCssPath+'min.css', minified.styles);
});

var minifyjsfiles = [];
for(i=0; i<config.assets.js.length; ++i) {
  if(config.assets.js[i].indexOf('#nomin') === -1){
    minifyjsfiles.push(srcPath + config.assets.js[i]);
  }
}

//Minify js
mkdirp.sync(destJsPath);
var result = UglifyJS.minify(minifyjsfiles);
fs.writeFileSync(destJsPath+'min.js', result.code);
