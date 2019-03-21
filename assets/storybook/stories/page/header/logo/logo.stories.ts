import { storiesOf } from "@storybook/react";

const Logo = require('./logo.html.twig');

storiesOf('Page/Header/Logo', module)
    .add('Simple', () => Logo({
        frontpage: '/',
        sitename: 'Amazee Labs'
    }));
