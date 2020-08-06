export const shrinkLabels = () => {
  const inputArr = Array.from(document.querySelectorAll('.form-input'));
  inputArr.forEach(el => {
    el.addEventListener('change', () => {
      el.nextElementSibling.classList.add('shrink');
    });
  });
};
