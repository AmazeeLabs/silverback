import { storiesOf } from "@storybook/html";

const Header = require('./header.html.twig');

storiesOf('Page/Header', module)
    .add('Simple', () => Header({
        frontpage: '/',
        sitename: 'AmazeeLabs'
    }));
