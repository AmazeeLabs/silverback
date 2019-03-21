import { storiesOf } from "@storybook/html";

const Logo = require('./logo.html.twig');

storiesOf('Page/Header/Logo', module)
    .add('Simple', () => Logo({
        frontpage: '/gogo',
        sitename: 'Amazee Labs'
    }));
