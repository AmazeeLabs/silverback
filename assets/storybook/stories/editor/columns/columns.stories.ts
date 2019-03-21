import { storiesOf } from "@storybook/html";
import './columns';

import snippet from './columns.html';

storiesOf('Editor/Columns', module)
    .add('simple', () => `
        <sb-columns>
            <div slot="left">Left</div>
            <div slot="right">Right</div>
        </sb-columns>
    `);
