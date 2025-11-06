import { Mark, mergeAttributes } from '@tiptap/core';

const SpellError = Mark.create({
  name: 'spellError',
  group: 'inline',
  inclusive: false,
  excludes: '',
  parseHTML() {
    return [{ tag: 'span.spell-error' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { class: 'spell-error' }),
      0,
    ];
  },
});

export default SpellError;
