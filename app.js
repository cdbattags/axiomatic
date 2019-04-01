const axios = require('axios')
const _ = require('lodash')
const cheerio = require('cheerio')
const htmlDecode = require('decode-html')

const numberEmpireURL = 'https://www.numberempire.com/'

function stripTags(html) {
  let result = ''
  let add = true
  let c
  
  for (let i = 0; i < html.length; i++) {
    c = html[i]
    if (c == '<') add = false
    else if (c == '>') add = true
    else if (add) result += c
  }

  return result
}

const clean = (string) => {
  return htmlDecode(
    string.replace(/(\n)|(\s{3})/g, "").trim()
  )
}

const go = async () => {
  for (let i = 1; i < 11; i++) {
    
    const response = await axios.get(`${numberEmpireURL}/${i}`) 
    const $ = cheerio.load(response.data)

    const tables = $('table.center')

    const rows = $(tables[1]).find('tr')
    
    _.each(rows, (row, index) => {
      const right = $(row).find('.right').html()
      const left = $(row).find('.left').html()
      const stripRight = clean(stripTags(right))
      const stripLeft = clean(stripTags(left))

      console.log(`${stripRight} => ${stripLeft}`)
    })

    
  }
}

go()