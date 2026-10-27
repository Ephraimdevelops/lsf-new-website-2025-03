import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function tabBar({ prevent = false } = {}) {
  const events = [], destinations = [], hrefs = [];
  const routes = ['index', 'cases', 'help', 'learn', 'profile'].map(name => ({ name, key: `tab-${name}` }));
  const deps = {
    react: { useEffect() {}, useState: () => [false, () => {}] },
    'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) },
    'react-native': { StyleSheet: { create: value => value }, View: 'View' },
    'expo-router': { useRouter: () => ({ navigate: href => hrefs.push(href) }) },
    'react-native-safe-area-context': { useSafeAreaInsets: () => ({ bottom: 0 }) },
    '../theme': { colors: {}, type: {} },
    '@expo/vector-icons/Ionicons': { __esModule: true, default: 'Icon' },
  };
  const source = readFileSync(new URL('../mobile/src/components/FloatingTabBar.tsx', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(`(function(require,module,exports){${code}\n})`)(name => { assert.ok(deps[name], `Unexpected dependency: ${name}`); return deps[name]; }, module, module.exports);
  const tree = module.exports.FloatingTabBar({ state: { index: 0, routes }, descriptors: Object.fromEntries(routes.map(route => [route.key, { options: { title: route.name } }])), emitter: { emit(event) { events.push(event); return { defaultPrevented: prevent }; } }, navigateToTab: key => destinations.push(key) });
  return { press: name => tree.props.children.find(item => item.props.label === name).props.onPress(), events, destinations, hrefs };
}

test('SDK 58 bottom menu emits tabPress and navigates through the navigator callback', () => {
  const bar = tabBar(); bar.press('cases');
  assert.deepEqual(JSON.parse(JSON.stringify(bar.events)), [{ type: 'tabPress', target: 'tab-cases', canPreventDefault: true }]);
  assert.deepEqual(bar.destinations, ['tab-cases']);
});
test('prevented tab presses do not navigate or change saved-view parameters', () => {
  const bar = tabBar({ prevent: true }); bar.press('cases'); bar.press('learn');
  assert.deepEqual(bar.destinations, []); assert.deepEqual(bar.hrefs, []);
});
test('Saved opens the saved view through a complete router href', () => {
  const bar = tabBar(); bar.press('learn');
  assert.equal(JSON.stringify(bar.hrefs), JSON.stringify([{ pathname: '/(tabs)/learn', params: { view: 'saved' } }]));
  assert.deepEqual(bar.destinations, []);
});
test('pressing the focused home tab does not add navigation', () => {
  const bar = tabBar(); bar.press('index');
  assert.equal(bar.events.length, 1); assert.deepEqual(bar.destinations, []);
});
