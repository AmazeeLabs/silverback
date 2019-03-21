import { storiesOf } from "@storybook/react";
import * as faker from "faker";

const Page = require('./page.html.twig');


storiesOf('Page', module)
    .add('Simple', () => Page({content: faker.lorem.paragraphs(3)}));
