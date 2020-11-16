import { storiesOf } from '@storybook/html';

import Text from './text.twig';
import './text.css';

export const plain = `
  Don't eat the yellow snow!
`;
export const text = `
  There isn't a <em>rule</em>. You just practice and find out which way works best for <strong>you</strong>.
  The only thing worse than <a href="https://en.wikipedia.org/wiki/Don%27t_Eat_the_Yellow_Snow">yellow snow</a> is
  green snow. I get carried away with this brush cleaning. We have a fantastic little sky! Let's get crazy.
  This is probably the greatest thing to happen in my life - to be able to share this with you.
`;

storiesOf('Base/Text', module)
  .add('Plain', () => Text({ text: plain }))
  .add('Formatted', () => Text({ text }));
