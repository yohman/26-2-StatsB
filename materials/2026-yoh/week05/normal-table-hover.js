(() => {
  const table = document.querySelector('.scroll table');
  if (!table) return;
  let current = null;
  let guides = [];
  function clear() {
    guides.forEach(cell => cell.classList.remove('lookup-guide'));
    current?.classList.remove('lookup-current');
    guides = [];
    current = null;
  }
  function highlight(cell) {
    if (cell === current) return;
    clear();
    if (!cell || cell.tagName !== 'TD' || !table.contains(cell)) return;
    current = cell;
    const column = cell.cellIndex;
    guides = [...cell.parentElement.cells,
      ...Array.from(table.rows, row => row.cells[column]).filter(Boolean)];
    guides.forEach(guide => guide.classList.add('lookup-guide'));
    cell.classList.add('lookup-current');
  }
  table.addEventListener('pointerover', event => highlight(event.target.closest('td')));
  table.addEventListener('pointerleave', clear);
  table.addEventListener('pointercancel', clear);
})();
