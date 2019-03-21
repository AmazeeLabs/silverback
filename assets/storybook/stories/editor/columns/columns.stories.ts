import { storiesOf } from "@storybook/html";
import './columns.component';

storiesOf('Editor/Columns', module)
    .add('simple', () => `
        <sb-columns>
            <div slot="left">Left</div>
            <div slot="right">Right</div>
        </sb-columns>
    `);
