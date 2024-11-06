import createFeedModule from '../core';
import * as cheerio from 'cheerio';
import { pureContent } from '../utils/pure';
import { formatUrl } from '../utils/format';

const shopify = createFeedModule({
  keyName: 'shopify',
  url: 'https://shopify.engineering/authors/shopify-engineering',
  title: 'Shopify Engineering',
  description: 'The latest articles from Shopify Engineering',
  copyright: 'Shopify',
  getLinksMethod: async () => {
    const response = await fetch('https://shopify.engineering/authors/shopify-engineering')
    if (!response.ok) return []
    const html = await response.text()
    const $ = cheerio.load(html)
    const articles = $('.article--index')
    return articles.map((index, element) => {
      const link = $(element).find('a').attr('href')
      return link
    }).get()
  },
  fetchSourceMethod: async (link) => {
    const response = await fetch(`https://shopify.engineering${formatUrl(link)}`)
    if (!response.ok) return null
    const html = await response.text()
    const { title, description, cheerio: $ } = pureContent(html)
    const contentHTML = $('#article-content').html()
    return {
      title,
      description,
      content: contentHTML ?? '',
      originalLink: `https://shopify.engineering${formatUrl(link)}`
    }
  }
})

export default shopify
