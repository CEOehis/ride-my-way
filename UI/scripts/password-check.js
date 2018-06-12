'use strict';

const reportDiv = document.querySelector('.report');
const passwordInput = document.querySelector('#password');
const passwordConfirmInput = document.querySelector('#password2');
const form = document.querySelector('#register');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;
  if (password.length < 6) {
    removeFeedbackClasses();
    reportDiv.classList.add('error');
    reportDiv.innerHTML = '<p>Password can\'t be less than <br /> 6 characters.</p>'
    return;
  }
  if (password !== passwordConfirm) {
    removeFeedbackClasses();
    reportDiv.classList.add('error');
    reportDiv.innerHTML = '<p>passwords do not match</p>'
    return;
  }
  // navigate to main app page
  window.location.href="/app.html"
  // remove feedback classes from reportDiv
})
const removeFeedbackClasses = () => {
  const [report, ...reportClasses] = reportDiv.classList;
  reportClasses.length && reportDiv.classList.remove(reportClasses);
}

// listen for a keydown event on the input field and clear notification messages
passwordInput.addEventListener('keydown', () => {
  removeFeedbackClasses();
  reportDiv.innerHTML = ''
});

passwordConfirmInput.addEventListener('keydown', () => {
  removeFeedbackClasses();
  reportDiv.innerHTML = ''
});
