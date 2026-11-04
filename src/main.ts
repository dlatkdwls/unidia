import { App } from './ui/App';

const root = document.getElementById('app');
if (!root) throw new Error('#app 요소를 찾을 수 없습니다');

new App(root).mount();
