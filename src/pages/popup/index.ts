import Main from '$lib/components/TicTacToe/TicTacToeMain.svelte';


import "./app.pcss";

function restoreMain() {
  const app = new Main({
    target: document.body,
  });
}

document.addEventListener('DOMContentLoaded', restoreMain);
