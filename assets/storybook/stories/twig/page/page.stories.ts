import { storiesOf } from "@storybook/html";

const Page = require('./page.html.twig');


storiesOf('Page', module)
    .add('Simple', () => Page({content: "test"}));
