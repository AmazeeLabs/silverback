import { storiesOf } from "@storybook/react";
import './columns';
import * as React from "react";
import * as faker from "faker";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "sb-columns": any
        }
    }
}

storiesOf('Editor/Columns', module)
    .add('simple', () => (
        <sb-columns>
            <div slot="left">{faker.lorem.paragraphs(2)}</div>
            <div slot="right">{faker.lorem.paragraphs(5)}</div>
        </sb-columns>
    ));
