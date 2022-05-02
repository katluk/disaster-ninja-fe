export function parseLinksAsTags(text?: string): string {
  if (!text) return '';
  let parsed = text;
  // this regex will find all the links, both in standart and .md format. '.md' format is [label](link)
  // with 2 extra characters at the begining (to find .md links)
  // See regex explanation at https://regex101.com/
  // In regex we cannot use negative lookbehind because of Safari:(
  // Therefore i need to implement following logic using .startsWith()
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
    const linkIndex = match.indexOf('http');
    const fullLink = match.substring(linkIndex);
    const linkPrefix = match.substring(0, linkIndex);

    // we're not using replace methods because they might not work for the same repeating links
    const finalText =
      parsed.substring(0, matchIndex + lengthIncreased) +
      linkPrefix +
      `[${domain}${path ?? ''}](${fullLink})` +
      parsed.substring(matchIndex + matchLength + lengthIncreased);

    lengthIncreased +=
      `[${domain}${path ?? ''}](${fullLink})`.length -
      (matchLength - linkPrefix.length);
    parsed = finalText;
  });

  return parsed;
}
