import postcss from 'postcss';
import ava from 'ava';
import nano from '..';
import {usePostCSSPlugin} from '../../../../util/testHelpers';
import processCss from './_processCss';
import specName from './util/specName';

function pluginMacro (t, instance) {
    const css = 'h1 { color: #ffffff }';
    const min = 'h1{color:#fff}';

    return instance.process(css).then((result) => {
        t.deepEqual(result.css, min, specName('beConsumedByPostCSS'));
    });
}

ava('can be used as a postcss plugin', pluginMacro, postcss().use(nano()));
ava('can be used as a postcss plugin (2)', pluginMacro, postcss([nano()]));
ava('can be used as a postcss plugin (3)', pluginMacro, postcss(nano));

ava(
    'should use the postcss plugin api',
    usePostCSSPlugin,
    nano()
);

ava.skip('should not fail when options.safe is enabled', t => {
    const css = 'h1 { z-index: 100 }';
    const min = 'h1{z-index:100}';

    return processCss(t, css, min, {safe: true});
});

ava.skip('should not fail second time when the same options are passed in, with options.safe as enabled', t => {
    const css = 'h1 { z-index: 100 }';
    const min = 'h1{z-index:100}';
    const options = {safe: true};

    return nano.process(css, options)
        .then(result => {
            t.deepEqual(result.css, min, specName('beConsumedByPostCSS'));
        })
        .then(() => nano.process(css, options))
        .then(result => {
            t.deepEqual(result.css, min, specName('beConsumedByPostCSS'));
        });
});

ava('should work with sourcemaps', t => {
    return nano.process('h1{z-index:1}', {map: {inline: true}}).then(({css}) => {
        const hasMap = /sourceMappingURL=data:application\/json;base64/.test(css);
        t.truthy(hasMap);
    });
});
