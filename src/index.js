'use strict'

import urljoin from 'url-join'
import base64 from './lib/base64'
import utf8bytes from 'utf8-bytes'
import pako from 'pako'
import markdownitfence from 'markdown-it-fence'

const generateSourceDefaultUrl = () => {
  return 'https://blockdiag-api.com/'
}

const getImageURL = (diagType, code, generateSourceUrl) => {
  var data = utf8bytes(code)
  var binaryString = pako.deflate(data, { to: 'string', raw: true })
  var deflated_code = base64.toBase64(binaryString)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
  const image_url = urljoin(generateSourceUrl, 'api', 'v1', diagType, 'inflate', deflated_code)
  return image_url
}

const render = (image_url) => {
  return `<a href="${image_url}" target="_blank"><img src="${image_url}" alt="${image_url}" /></a>`
}

const BlockdiagRender = (generateSourceUrl) => {
  return (tokens, idx, options, env) => {
    const token = tokens[idx]
    const diag_type = token.info.trim()
    const code = token.content.trim()
    const image_url = getImageURL(diag_type, code, generateSourceUrl)
    return render(image_url)
  }
}

const BlockdiagValidate = (params) => {
  const diag_types = [
    "actdiag",
    "blockdiag",
    "nwdiag",
    "packetdiag",
    "rackdiag",
    "seqdiag"
  ]

  var type = params.trim().split(' ', 2)[0]
  return diag_types.includes(type)
}

const BlockdiagPlugin = (md, options) => {
  options = options || {}

  var generateSourceUrl = options.generateSourceUrl || generateSourceDefaultUrl()
  var render = options.render || md.renderer.rules.image
  var marker = options.marker || '```'

  return markdownitfence(md, 'blockdiag', {
    marker: marker,
    render: BlockdiagRender(generateSourceUrl),
    validate: BlockdiagValidate,
  })
}

module.exports = BlockdiagPlugin
