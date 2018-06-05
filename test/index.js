import assert from 'power-assert'
import markdownIt from 'markdown-it'
import markdownItBlockdiag from '../dist/main'

const mdi = markdownIt()
mdi.use(markdownItBlockdiag)

assert(mdi.render('# Hello world').trim() === '<h1>Hello world</h1>', '# Hello world')
assert(mdi.render('Hello world').trim() === '<p>Hello world</p>', 'Hello world')

const expectTemplate = (url, diagType, expectDeflate) => {
  return `<a href="${url}/api/v1/${diagType}/inflate/${expectDeflate}" target="_blank"><img src="${url}/api/v1/${diagType}/inflate/${expectDeflate}" alt="${url}/api/v1/${diagType}/inflate/${expectDeflate}" /></a>`;
}

it('blockdiag', () => {
  var render_text = mdi.render(`\`\`\`blockdiag
  {
    A -> B;
  }
  \`\`\``);
  assert(render_text === expectTemplate('https://blockdiag-api.saino.me', 'blockdiag', 'q-ZSAAJHBV07BSdrILsWAA=='))
});

it('seqdiag', () => {
  var render_text = mdi.render(`\`\`\`seqdiag
  {
    A -> B;
    A <-- B;
  }
  \`\`\``);
  var expect = expectTemplate('https://blockdiag-api.saino.me', 'seqdiag', 'q-ZSAAJHBV07BSdrKNtGVxfCqQUA')
  assert(render_text === expect)
});

it('pre block', () => {
  var render_text = mdi.render(`\`\`\`shell
{
  testString
}
\`\`\``);
  var expect = `<pre><code class="language-shell">{
  testString
}
</code></pre>
`

  assert(render_text === expect)
});

it('change url', () => {
  mdi.use(markdownItBlockdiag, { generateSourceUrl: 'http://localhost:8000' });
  var render_text = mdi.render(`\`\`\`blockdiag
  {
    A -> B;
  }
  \`\`\``);
  assert(render_text === expectTemplate('http://localhost:8000', 'blockdiag', 'q-ZSAAJHBV07BSdrILsWAA=='))
});
