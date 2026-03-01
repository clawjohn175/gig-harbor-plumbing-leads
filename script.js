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

  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    msg.textContent = 'Thanks! Your request was submitted. A local plumbing pro will contact you soon.';
    msg.style.color = '#0a7a35';
    form.reset();
  } catch (error) {
    msg.textContent = 'Sorry, there was an issue sending your request. Please call instead for urgent jobs.';
    msg.style.color = '#b00020';
  }
});
