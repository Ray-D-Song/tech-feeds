import createFeedModule from '../core';
import * as cheerio from 'cheerio';
import { pureContent } from '../utils/pure';
import { formatUrl } from '../utils/format';

const notion = createFeedModule({
  keyName: 'notion',
  url: 'https://www.notion.com/blog/topic/tech',
  title: 'Notion Tech Blog',
  description: 'The latest articles from Notion Tech Blog',
  copyright: 'Notion',
  getLinksMethod: async () => {
    const response = await fetch('https://www.notion.com/blog/topic/tech')
    if (!response.ok) return []
    const html = await response.text()
    const $ = cheerio.load(html)
    const links: string[] = []
    $('.post-preview').each(function () {
      const href = $(this).find('a').first().attr('href')
      if (href) {
        links.push(href)
      }
    })
    return links
  },
  fetchSourceMethod: async (link) => {
    const response = await fetch(`https://www.notion.com${link}`)
    if (!response.ok) return null
    const html = await response.text()
    const { title, description, cheerio: $ } = pureContent(html)
    const contentHTML = $('article').first().html()
    return {
      title,
      description,
      content: contentHTML ?? '',
      originalLink: `https://www.notion.com${formatUrl(link)}`
    }
  }
})

export default notion
