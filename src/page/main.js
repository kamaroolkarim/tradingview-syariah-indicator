(async() => {
  const validUrls = [
    { url: 'tradingview.com/chart', scripts: ['chart.js', 'screener.js'] },
    { url: 'tradingview.com/screener', scripts: ['screener.js'] },
    { url: 'tradingview.com/symbols', scripts: ['symbols.js'] },
  ]

  for (const { url, scripts } of validUrls) {
    if (new RegExp(url).test(window.location.href)) {
      for (const js of scripts) {
        const jsPath = browser.extension.getURL(`src/page/${ js }`)
        await import(jsPath)
      }
    }
  }
})()
