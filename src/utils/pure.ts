import * as cheerio from 'cheerio'

export function pureContent(raw: string) {
  const $ = cheerio.load(raw)
  $('script').remove()
  $('style').remove()
  $('canvas').remove()
  $('input').remove()
  $('form').remove()
  return {
    title: $('title').text(),
    description: $('meta[name="description"]').attr('content') ?? '',
    cheerio: $
  }
}
