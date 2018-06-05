'use strict';

import urljoin from 'url-join'
import base64 from './lib/base64'
import utf8bytes from 'utf8-bytes'
import pako from 'pako'

const generateSourceDefaultUrl = () => {
  return 'https://blockdiag-api.saino.me/';
}

const getImageURL = (diagType, code, generateSourceUrl) => {
  var data = utf8bytes(code)
  var binaryString = pako.deflate(data, { to: 'string', raw: true })
  var deflated_code = base64.toBase64(binaryString)
    .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
  const image_url = urljoin(generateSourceUrl, 'api', 'v1', diagType, 'inflate', deflated_code);
  return image_url
}

const blockdiagRender = (image_url) => {
  return `<a href="${image_url}" target="_blank"><img src="${image_url}" alt="${image_url}" /></a>`
}

export default (md, options) => {
  options = options || {};

  const diag_types = [
    "actdiag",
    "blockdiag",
    "nwdiag",
    "packetdiag",
    "rackdiag",
    "seqdiag"
  ];
  var generateSourceUrl = options.generateSourceUrl || generateSourceDefaultUrl();
  var render = options.render || md.renderer.rules.image;

  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (diag_types.includes(token.info)) {
      var image_url = getImageURL(token.info, code, generateSourceUrl);
      return blockdiagRender(image_url);
    }
    return temp(tokens, idx, options, env, slf);
  };

  md.renderer.rules.blockdiag = render;
}
