export function parseLinksAsTags(text?: string): string {
  if (!text) return '';
  let parsed = text;
  // In regex we cannot use negative lookbehind because of Safari:(
  // Therefore i need to implement following logic:
  // this regex will find all the links, both in standart and .md format. '.md' format is [label](link)
  // with 2 extra characters at the begining (to throw away links in .md format)

  // See regex explanation at https://regex101.com/
  const regex =
    /(.?.?https|.?.?http)(:\/\/)([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;
  const matchIterable = text.matchAll(regex);

  let lengthIncreased = 0;

  [...matchIterable].forEach((matchEntity) => {
    const [match, protocol, , domain, path] = matchEntity;
    const matchIndex = matchEntity.index!;
    const matchLength = match.length;
    // skip links in propper markdown format
    if (match.startsWith('](')) return;
    // get full link to work with it
    const linkStartIndex = match.indexOf('http');
    const fullLink = match.substring(linkStartIndex);
    const beforeLink = match.substring(0, linkStartIndex);

    // we're not using replace methods because they might not work for the same repeating links
    const finalText =
      parsed.substring(0, matchIndex + lengthIncreased) +
      beforeLink +
      `[${domain}${path ?? ''}](${fullLink})` +
      parsed.substring(matchIndex + matchLength + lengthIncreased);

    lengthIncreased +=
      `[${domain}${path ?? ''}](${fullLink})`.length -
      (matchLength - beforeLink.length);
    parsed = finalText;
  });

  return parsed;
}
