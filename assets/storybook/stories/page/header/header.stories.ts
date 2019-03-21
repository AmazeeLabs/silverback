import { storiesOf } from "@storybook/react";

const Header = require('./header.html.twig');

storiesOf('Page/Header', module)
    .add('Simple', () => Header({
        frontpage: '/',
        sitename: 'AmazeeLabs'
    }));
