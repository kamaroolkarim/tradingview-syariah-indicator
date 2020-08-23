const fs = require('fs')
const csso = require('csso')
const { ncp } = require('ncp')
const { minify: terserMinifier } = require('terser')
const { minify: htmlMinifier } = require('html-minifier')

const outputPath = './dist'
const terserConfig = {
  ecma: 6,
  mangle: true,
  compress: true
}

const htmlMinifierConfig = [
  'collapseWhitespace',
  'collapseBooleanAttributes',
  'html5',
  'removeComments',
  'removeEmptyAttributes',
  'sortAttributes'
].reduce((acc, i) => ({
  ...acc,
  [`${ i }`]: true
}), {})

async function writeToFile(filename, data) {
  try {
    fs.writeFileSync(`${ outputPath }/${ filename }`, data, {
      encoding: 'utf-8',
      recursive: true
    }, function (err) {
      if (err) {
        console.log(err)
        throw Error(`Unable to write to file ${ filename }`)
      }
    })

    console.log(`Saved in: ${ filename }`)
  } catch (e) {
    console.error('Error write data', e)
    process.exit(1)
  }
}

function createFolder(folders) {
  folders.forEach(folder => fs.mkdirSync(`${ outputPath }/src/${ folder }`, { recursive: true }))
}

function copyFiles(filesPaths) {
  function callback(err) {
    if (err) throw err
    console.log('source.txt was copied to destination.txt')
  }

  // destination.txt will be created or overwritten by default.
  for (let filesPath of filesPaths) {
    fs.copyFile(filesPath, `${ outputPath }/${ filesPath }`, callback)
  }
}

function copyFolders(folderPaths) {
  for (let path of folderPaths) {
    ncp(path, `${ outputPath }/${ path }`, function (err) {
      if (err) {
        return console.error(err)
      }
      console.log('done!')
    })
  }
}

(async() => {
  // delete dist folder and recreate folders
  fs.rmdirSync(outputPath, { recursive: true })
  createFolder(['bg', 'page', 'popup'])

  copyFiles(['manifest.json'])
  copyFolders(['_locales', 'assets'])

  // css
  for (const htmlPath of [
    'src/popup/popup.css'
  ]) {
    const file = fs.readFileSync(htmlPath, 'utf8')
    writeToFile(htmlPath, csso.minify(file).css)
  }

  // html
  for (const htmlPath of [
    'src/bg/bg.html',
    'src/popup/popup.html'
  ]) {
    const file = fs.readFileSync(htmlPath, 'utf8')
    writeToFile(htmlPath, htmlMinifier(file, htmlMinifierConfig))
  }

  // js
  for (const jsPath of [
    'src/page/main.js',
    'src/page/chart.js',
    'src/page/screener.js',
    'src/page/symbols.js',
    'src/bg/bg.js',
    'src/popup/popup.js',
    'src/helper.js',
    'src/browser-polyfill.js'
  ]) {
    const file = fs.readFileSync(jsPath, 'utf8')
    writeToFile(jsPath, (await terserMinifier(file, terserConfig)).code)
  }
})()


