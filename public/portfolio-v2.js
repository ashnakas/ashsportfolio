// Small, local interaction sketches. No live inventory, recommendations, or camera access.
const price = document.querySelector('#price');
function updateListings() {
  const budget = Number(price.value);
  document.querySelector('#price-value').textContent = `$${budget}`;
  let count = 0;
  document.querySelectorAll('.listing').forEach(item => {
    const available = Number(item.dataset.price) <= budget;
    item.classList.toggle('over-budget', !available);
    if (available) count++;
  });
  document.querySelector('#recart-status').textContent = count ? `${count} sample find${count === 1 ? '' : 's'} within your budget` : 'No sample finds. Try a larger budget.';
}
price?.addEventListener('input', updateListings);
if (price) updateListings();
const directions = {
  vintage: ['A vintage direction', 'Explore warm woods and secondhand pieces.'],
  color: ['A colorful direction', 'Explore bold colors and playful combinations.'],
  budget: ['A budget-conscious direction', 'Explore simple pieces and affordable alternatives.']
};
document.querySelectorAll('button[data-direction]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('button[data-direction]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const direction = button.dataset.direction;
  document.querySelector('.pin-room').dataset.direction = direction;
  document.querySelector('#room-label').textContent = directions[direction][0];
  document.querySelector('#pin-status').textContent = directions[direction][1];
}));
const paths = {
  artist: ['Find a performance opportunity', 'Start with programs, eligibility, and a clear way to get in touch.'],
  support: ['Support the artists', 'Find the mission, ways to give, and what your support makes possible.'],
  community: ['Find your way to connect', 'Start with events, community information, and contact options.']
};
document.querySelectorAll('[data-path]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-path]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  document.querySelector('#show-next-title').textContent = paths[button.dataset.path][0];
  document.querySelector('#show-next-copy').textContent = paths[button.dataset.path][1];
}));
const angle = document.querySelector('#solar-angle');
function updateSolar() {
  const tilt = Number(angle.value);
  const output = Math.round(Math.cos(tilt * Math.PI / 180) * 100);
  document.querySelector('#solar-panel').setAttribute('transform', `rotate(${tilt} 267 170)`);
  document.querySelector('#solar-value').textContent = `${output}%`;
  document.querySelector('#solar-description').textContent = output > 95 ? 'Aligned. More light reaches the array.' : 'Tilt the array toward the light.';
}
angle?.addEventListener('input', updateSolar);
if (angle) updateSolar();
