const form = document.getElementById('plumbingLeadForm');
const msg = document.getElementById('formMessage');
document.getElementById('year').textContent = new Date().getFullYear();

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!form.checkValidity()) {
    msg.textContent = 'Please complete all required fields.';
    msg.style.color = '#b00020';
    form.reportValidity();
    return;
  }

  const data = Object.fromEntries(new FormData(form).entries());
  data.createdAt = new Date().toISOString();
  data.city = 'Gig Harbor';
  data.state = 'WA';

  // v1 demo: save lead locally for testing
  // Next step: send to backend webhook / CRM / plumber dispatch queue.
  const existing = JSON.parse(localStorage.getItem('plumbingLeads') || '[]');
  existing.push(data);
  localStorage.setItem('plumbingLeads', JSON.stringify(existing));

  msg.textContent = 'Thanks! Your request was submitted. A local plumbing pro will contact you soon.';
  msg.style.color = '#0a7a35';
  form.reset();
});
